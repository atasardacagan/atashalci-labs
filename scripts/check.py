"""Check built pages for broken local references and basic document invariants."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit
import gzip
import hashlib
import json
import re
import struct
from xml.etree import ElementTree
from build import ORIGIN, BASE_PATH, LOCALES, load_catalog, validate_catalogs

DIST = Path(__file__).resolve().parents[1] / "dist"


def local_path(path):
    """Map a public absolute URL path into the Pages artifact's root."""
    decoded = unquote(path)
    if BASE_PATH:
        assert decoded.startswith(BASE_PATH + '/'), f"Reference leaves deployment path: {path}"
        decoded = decoded[len(BASE_PATH):]
    return decoded


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.ids = []
        self.references = []
        self.id_references = []
        self.headings = 0
        self.language = None
        self.title = False
        self.title_text = ""
        self.in_title = False
        self.metadata = {}
        self.canonicals = []
        self.alternates = {}
        self.locale_keys = []
        text = path.read_text()
        assert not re.search(r"\{\{[^}]+\}\}", text), f"Unresolved template: {path}"
        self.feed(text)
        match = re.search(r'<script type="application/json" id="locale-data">(.*?)</script>', text, re.S)
        assert match, f"Missing initial locale: {path}"
        self.config = json.loads(match[1])
        self.visible_html = re.sub(r'<script\b[^>]*>.*?</script>', '', text, flags=re.S)

    def handle_starttag(self, tag, items):
        attrs = dict(items)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if attrs.get("data-i18n"):
            self.locale_keys.append(attrs["data-i18n"])
        self.locale_keys.extend(pair.split(":", 1)[1] for pair in attrs.get("data-i18n-attrs", "").split(";") if pair)
        for name in ("href", "src"):
            if attrs.get(name):
                self.references.append(attrs[name])
        for name in ("for", "aria-labelledby", "aria-describedby", "aria-controls"):
            self.id_references.extend((attrs.get(name) or "").split())
        self.headings += tag == "h1"
        self.title |= tag == "title"
        if tag == "title": self.in_title = True
        if tag == "html":
            self.language = attrs.get("lang")
        if tag == "img":
            assert "alt" in attrs, f"Missing image alternative: {self.path}"
        if tag == "meta":
            name = attrs.get("name") or attrs.get("property")
            if name:
                assert name not in self.metadata, f"Duplicate metadata {name}: {self.path}"
                self.metadata[name] = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs.get("href"))
        if tag == "link" and attrs.get("rel") == "alternate":
            self.alternates[attrs.get("hreflang")] = attrs.get("href")
        if tag == "a":
            assert attrs.get("href") != "#", f"Placeholder link: {self.path}"
            if attrs.get("target") == "_blank":
                assert {"noopener", "noreferrer"} <= set(attrs.get("rel", "").split()), f"Unsafe external link: {self.path}"

    def handle_data(self, data):
        if self.in_title: self.title_text += data

    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False


catalogs = {locale: load_catalog(locale) for locale in LOCALES}
validate_catalogs(catalogs)
# Literal keys in branches are checked too, not just direct t('key') calls.
# Computed templates must have a corresponding catalog family. Full Operations
# combinations are additionally exercised by ops-state.test.mjs.
namespaces = '|'.join(sorted({key.split('.')[0] for key in catalogs['en']}))
key_pattern = re.compile(r"(['\"])((?:" + namespaces + r")\.[\w.]+)\1")
pattern_keys = re.compile(r"`((?:" + namespaces + r")\.[^`]+)`")
module_imports = []
runtime_keys = set()
for source in sorted((DIST / 'assets').iterdir()):
    if source.suffix not in {'.js', '.mjs'}: continue
    text = source.read_text()
    for _, key in key_pattern.findall(text):
        assert key in catalogs['en'], f"Missing runtime locale key {key}: {source.name}"
        runtime_keys.add(key)
    for key in pattern_keys.findall(text):
        parts = re.split(r"\$\{[^}]+\}", key)
        pattern = '^' + '.+'.join(re.escape(part) for part in parts) + '$'
        assert any(re.match(pattern, item) for item in catalogs['en']), f"Missing runtime locale family {key}: {source.name}"
    for reference in re.findall(r"(?:\bfrom\s*|\bimport\s*)(?:['\"])([^'\"]+)(?:['\"])", text):
        if not reference.startswith('.'): continue
        imported = (source.parent / urlsplit(reference).path).resolve()
        assert imported.is_relative_to(DIST) and imported.is_file(), f"Missing module import {reference}: {source.name}"
        if imported.name == 'i18n.js':
            assert reference == './i18n.js', f"Locale runtime must use one shared module URL: {source.name}"
        module_imports.append(reference)
for locale, catalog in catalogs.items():
    assert json.loads((DIST / 'assets' / 'locales' / (locale + '.json')).read_text()) == catalog, f"Stale catalog: {locale}"
pages = {path.resolve(): Page(path) for path in DIST.rglob("*.html")}
assert {str(path.relative_to(DIST)) for path in pages} == {'index.html', 'tr/index.html', '404.html', 'tr/404.html'}, "Unexpected public HTML route"
references = 0
for path, page in pages.items():
    assert page.headings == 1, f"Expected one h1: {path}"
    assert page.language and page.title, f"Missing document metadata: {path}"
    assert page.language == ('tr' if 'tr' in path.relative_to(DIST).parts else 'en'), f"Wrong page language: {path}"
    assert page.config['locale'] == page.language and page.config['messages'] == catalogs[page.language], f"Stale inline catalog: {path}"
    assert page.config['origin'] == ORIGIN
    assert page.config['basePath'] == BASE_PATH and page.config['routes'] == LOCALES
    assert page.config['urls'].keys() == LOCALES.keys(), f"Incomplete locale routes: {path}"
    for key in page.locale_keys:
        assert isinstance(catalogs[page.language].get(key), str), f"Non-text translation marker {key}: {path}"
    assert not any(urlsplit(reference).path == BASE_PATH + '/assets/i18n.js' for reference in page.references), f"Duplicate direct locale module entry: {path}"
    assert all(key in catalogs[page.language] for key in page.locale_keys), f"Missing translation marker: {path}"
    page.references.extend(page.config['urls'].values())
    duplicates = [key for key, count in Counter(page.ids).items() if count > 1]
    assert not duplicates, f"Duplicate IDs in {path}: {duplicates}"
    for target in page.id_references:
        assert target in page.ids, f"Missing accessible reference #{target}: {path}"
    for reference in page.references:
        parsed = urlsplit(reference)
        if parsed.scheme or parsed.netloc:
            continue
        if not parsed.path:
            target = path
        elif parsed.path.startswith("/"):
            target = DIST / local_path(parsed.path).lstrip("/")
        else:
            target = path.parent / unquote(parsed.path)
        if target.is_dir():
            target /= "index.html"
        target = target.resolve()
        assert target.is_relative_to(DIST), f"Reference escapes output: {reference}"
        assert target.is_file(), f"Missing {reference} from {path}"
        if parsed.path.startswith(BASE_PATH + "/assets/"):
            digest = hashlib.sha256(target.read_bytes()).hexdigest()[:10]
            assert parse_qs(parsed.query).get("v") == [digest], f"Stale or unversioned asset: {reference}"
        if parsed.fragment and target in pages:
            assert unquote(parsed.fragment) in pages[target].ids, f"Missing anchor {reference} from {path}"
        references += 1

# Sharing URLs must resolve to a real card on the configured public origin.
homepage = pages[(DIST / "index.html").resolve()]
meta = homepage.metadata
assert homepage.canonicals == [ORIGIN + LOCALES['en']], "Homepage canonical must preserve the configured origin and base path"
for name in ("description", "viewport", "og:title", "og:description", "og:site_name", "og:image:alt", "twitter:title", "twitter:description", "twitter:image:alt"):
    assert meta.get(name, "").strip(), f"Missing sharing/document metadata: {name}"
assert meta.get("og:url") == ORIGIN + LOCALES['en'], "Open Graph URL must match canonical"
assert meta.get("og:type") == "website"
assert meta.get("twitter:card") == "summary_large_image"
assert meta.get("twitter:image") == meta.get("og:image"), "Social preview images must agree"
image = urlsplit(meta.get("og:image", ""))
origin = urlsplit(ORIGIN)
assert (image.scheme, image.netloc) == (origin.scheme, origin.netloc), "Social image must use the configured public origin"
card = (DIST / local_path(image.path).lstrip("/")).resolve()
assert card.is_relative_to(DIST) and card.is_file(), "Missing local social preview image"
data = card.read_bytes()
assert data[:8] == b"\x89PNG\r\n\x1a\n", "Social preview must be a PNG"
assert struct.unpack(">II", data[16:24]) == (1200, 630), "Social preview must be 1200 × 630"
assert meta.get("og:image:width") == "1200" and meta.get("og:image:height") == "630"
assert meta.get("og:image:type") == "image/png"
assert parse_qs(image.query).get("v") == [hashlib.sha256(data).hexdigest()[:10]], "Stale social image fingerprint"
assert "noindex" not in meta.get("robots", ""), "Homepage must be indexable"
error = pages[(DIST / "404.html").resolve()]
assert "noindex" in error.metadata.get("robots", ""), "Error page must not be indexed"
sitemap = ElementTree.parse(DIST / "sitemap.xml")
locations = [item.text for item in sitemap.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
assert locations == [ORIGIN + route for route in LOCALES.values()], "Sitemap must contain the EN and TR homepages"
alternates = {**{locale: ORIGIN + route for locale, route in LOCALES.items()}, 'x-default': ORIGIN + LOCALES['en']}
for entry in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}url'):
    assert {node.get('hreflang'): node.get('href') for node in entry.findall('{http://www.w3.org/1999/xhtml}link')} == alternates, 'Sitemap alternates are incomplete'
for locale, route in LOCALES.items():
    directory = DIST / ('tr' if locale == 'tr' else '')
    page = pages[(directory / 'index.html').resolve()]
    assert page.canonicals == [ORIGIN + route] and page.alternates == alternates
    assert page.metadata['og:url'] == ORIGIN + route
    assert page.metadata['og:locale'] == ('tr_TR' if locale == 'tr' else 'en_US')
    assert page.metadata['og:locale:alternate'] == ('en_US' if locale == 'tr' else 'tr_TR')
    assert page.title_text == catalogs[locale]['static.meta.title'], f"Incorrect {locale} title"
    for name, key in [('description','static.meta.description'), ('og:title','static.meta.title'), ('og:description','static.meta.description'), ('twitter:title','static.meta.title'), ('twitter:description','static.meta.description'), ('og:image:alt','static.meta.share_alt'), ('twitter:image:alt','static.meta.share_alt')]:
        assert page.metadata[name] == catalogs[locale][key], f'Incorrect {locale} {name}'
    assert page.metadata['og:image'] == meta['og:image'], 'Use the same universal branded image'
    assert 'noindex' not in page.metadata.get('robots','')
    error_page = pages[(directory / '404.html').resolve()]
    assert 'noindex' in error_page.metadata.get('robots','') and not error_page.canonicals
    assert error_page.title_text == catalogs[locale]['static.error.title']
    assert error_page.metadata['description'] == catalogs[locale]['static.error.description']
    disclosure = re.findall(r'<span>(.*?)</span>', catalogs[locale]['static.lab_masthead.text'])[-1]
    assert disclosure and page.visible_html.count(disclosure) == 3, f'Every {locale} lab must be labeled'

assert "Sitemap: " + ORIGIN + BASE_PATH + "/sitemap.xml" in (DIST / "robots.txt").read_text()

# Content boundaries are part of this studio's public contract.
home = homepage.visible_html
assert home.count("SELF-INITIATED / LAB EXPERIMENT / PROTOTYPE") == 3, "Every lab must be labeled"
assert "Self-initiated experiments exploring software, AI, automation and digital interaction." in home
assert not (DIST / "work").exists(), "Retired portfolio output must not remain public"
retired = re.compile(r"collection.management|tahsilat|prim takip|payment|receivable|selected build", re.I)
for asset in DIST.rglob("*"):
    if asset.is_file() and asset.suffix in {".html", ".js", ".mjs", ".css", ".xml", ".txt", ".json"}:
        assert not retired.search(asset.read_text()), f"Retired project reference: {asset}"

assets = [p for p in (DIST / "assets").iterdir() if p.is_file()]
raw = sum(p.stat().st_size for p in assets)
compressed = sum(len(gzip.compress(p.read_bytes(), mtime=0)) for p in assets)
print(f"Passed: {len(pages)} pages, {references} local references, all ID relationships, social metadata and asset fingerprints.")
print(f"Locales: {len(catalogs['en'])} paired keys; recursive structures and interpolation match; both routes and all hreflang relationships validated.")
print(f"Runtime: {len(runtime_keys)} literal keys and computed key families checked; {len(module_imports)} local module imports resolve with a single locale runtime URL.")
print(f"Assets: {raw:,} bytes raw; {compressed:,} bytes with gzip (local size estimate).")
