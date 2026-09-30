"""Render two curated languages from shared templates; no runtime translation service."""
from html import escape
from pathlib import Path
import hashlib
import json
import os
import re
import shutil
from urllib.parse import quote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
T = ROOT / "templates"
ORIGIN = os.environ.get("SITE_ORIGIN", "https://atashalci-labs.acagan0.chatgpt.site").rstrip("/")
BASE_PATH = os.environ.get("SITE_BASE_PATH", "").rstrip("/")
TRAILING_SLASH = os.environ.get("SITE_TRAILING_SLASH", "0") == "1"
origin_parts = urlsplit(ORIGIN)
if origin_parts.scheme not in {"http", "https"} or not origin_parts.netloc or origin_parts.path or origin_parts.query or origin_parts.fragment or origin_parts.username:
    raise ValueError("SITE_ORIGIN must be an HTTP(S) origin without a path or credentials")
if BASE_PATH and not re.fullmatch(r"/(?:[A-Za-z0-9_-]+/)*[A-Za-z0-9_-]+", BASE_PATH):
    raise ValueError("SITE_BASE_PATH must be an absolute directory path without a trailing slash")
LOCALES = {"en": BASE_PATH + "/", "tr": BASE_PATH + "/tr" + ("/" if TRAILING_SLASH else "")}


def e(value):
    return escape(str(value), quote=True)


def asset_url(path):
    file = DIST / path.lstrip("/")
    if not file.is_file():
        raise FileNotFoundError("Missing asset: " + path)
    digest = hashlib.sha256(file.read_bytes()).hexdigest()[:10]
    return BASE_PATH + path + "?v=" + digest


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"Duplicate locale key: {key}")
        result[key] = value
    return result


def validate_catalogs(catalogs):
    """Fail before writing output if curated locales cannot present the same UI."""
    def compare(reference, candidate, path):
        if type(reference) is not type(candidate):
            raise ValueError(f"Locale type mismatch: {path}")
        if isinstance(reference, dict):
            if reference.keys() != candidate.keys():
                raise ValueError(f"Locale keys differ at {path}: {reference.keys() ^ candidate.keys()}")
            for key in reference:
                compare(reference[key], candidate[key], path + "." + key)
        elif isinstance(reference, list):
            if len(reference) != len(candidate):
                raise ValueError(f"Locale list length mismatch: {path}")
            for index, (first, second) in enumerate(zip(reference, candidate)):
                compare(first, second, f"{path}[{index}]")
        elif isinstance(reference, str):
            placeholders = lambda value: set(re.findall(r"\{\w+\}", value))
            if placeholders(reference) != placeholders(candidate):
                raise ValueError(f"Locale placeholders differ: {path}")
    for locale, messages in catalogs.items():
        compare(catalogs["en"], messages, locale)


def load_catalog(locale):
    messages = {}
    for source in sorted((ROOT / "locales" / locale).glob("*.json")):
        content = json.loads(source.read_text(), object_pairs_hook=unique_object)
        duplicates = messages.keys() & content.keys()
        if duplicates:
            raise ValueError(f"Duplicate locale keys in {source}: {sorted(duplicates)}")
        messages.update(content)
    return messages


def render(template, values, messages, locale):
    text = template
    for key, value in values.items():
        text = text.replace("{{" + key + "}}", str(value))
    # Attribute strings are escaped; curated display copy can contain deliberate inline markup.
    def attr(match):
        content = re.sub(r"\{\{t:([^}]+)\}\}", lambda item: e(messages[item[1]]), match[2])
        return match[1] + '="' + content + '"'
    text = re.sub(r'([\w-]+)="([^"\n]*\{\{t:[^"\n]*)"', attr, text)
    text = re.sub(r"\{\{t:([^}]+)\}\}", lambda match: str(messages[match[1]]), text)
    missing = re.findall(r"\{\{[^}]+\}\}", text)
    if missing:
        raise ValueError("Missing template values: " + ",".join(missing))
    text = re.sub(r'href="/(#[^"]*)?"', lambda match: 'href="' + LOCALES[locale] + (match[1] or "") + '"', text)
    # Language anchors retain explicit targets after localized navigation is built.
    for language, route in LOCALES.items():
        text = re.sub(r'(data-language="' + language + r'"[^>]*href=")[^"]*', lambda match: match[1] + route, text)
    return re.sub(r'(src|href)="(/assets/[^"?]+)"',
                  lambda match: match[1] + '="' + asset_url(match[2]) + '"', text)


def head(messages, locale, error=False):
    title_key = "static.error.title" if error else "static.meta.title"
    description_key = "static.error.description" if error else "static.meta.description"
    title, description = messages[title_key], messages[description_key]
    parts = [
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width,initial-scale=1">',
        '<meta name="theme-color" content="#f2ebe6">',
        f'<script src="/assets/locale-preference.js" data-en-path="{e(LOCALES["en"])}" data-tr-path="{e(LOCALES["tr"])}"></script>',
        f'<title data-i18n="{title_key}">{e(title)}</title>',
        f'<meta name="description" content="{e(description)}" data-i18n-attrs="content:{description_key}">',
        '<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">',
    ]
    if error:
        parts.append('<meta name="robots" content="noindex">')
        styles = ("atelier", "reference")
    else:
        url = ORIGIN + LOCALES[locale]
        image = ORIGIN + asset_url("/assets/share-card.png")
        parts.append(f'<link rel="canonical" href="{url}">')
        for language, path in [*LOCALES.items(), ("x-default", LOCALES["en"])]:
            parts.append(f'<link rel="alternate" hreflang="{language}" href="{ORIGIN + path}">')
        for property_name, key in [("og:title", title_key), ("og:description", description_key), ("og:image:alt", "static.meta.share_alt")]:
            parts.append(f'<meta property="{property_name}" content="{e(messages[key])}" data-i18n-attrs="content:{key}">')
        parts.extend([
            '<meta property="og:site_name" content="ATASHALCI LABS">',
            '<meta property="og:type" content="website">',
            f'<meta property="og:locale" content="{"tr_TR" if locale == "tr" else "en_US"}">',
            f'<meta property="og:locale:alternate" content="{"en_US" if locale == "tr" else "tr_TR"}">',
            f'<meta property="og:url" content="{url}">',
            f'<meta property="og:image" content="{image}">',
            '<meta property="og:image:type" content="image/png">',
            '<meta property="og:image:width" content="1200">',
            '<meta property="og:image:height" content="630">',
            '<meta name="twitter:card" content="summary_large_image">',
            f'<meta name="twitter:image" content="{image}">',
        ])
        for name, key in [("twitter:title", title_key), ("twitter:description", description_key), ("twitter:image:alt", "static.meta.share_alt")]:
            parts.append(f'<meta name="{name}" content="{e(messages[key])}" data-i18n-attrs="content:{key}">')
        styles = ("atelier", "reference")
    parts.extend(f'<link rel="stylesheet" href="/assets/{style}.css">' for style in styles)
    return "".join(parts)


def language_switcher(locale, messages):
    links = []
    for language, path in LOCALES.items():
        active = ' aria-current="page"' if language == locale else ""
        links.append(f'<a data-language="{language}" href="{path}" lang="{locale}" hreflang="{language}"{active} aria-label="{e(messages["static.language." + language])}" data-i18n-attrs="aria-label:static.language.{language}">{language.upper()}</a>')
    return '<div class="language-slot"><nav class="language-switcher" aria-label="' + e(messages["static.language.label"]) + '" data-i18n-attrs="aria-label:static.language.label">' + '<span aria-hidden="true">/</span>'.join(links) + '</nav></div>'


def main():
    catalogs = {locale: load_catalog(locale) for locale in LOCALES}
    validate_catalogs(catalogs)
    locale_dir = DIST / "assets" / "locales"
    locale_dir.mkdir(exist_ok=True)
    for locale, messages in catalogs.items():
        (locale_dir / f"{locale}.json").write_text(json.dumps(messages, ensure_ascii=False, separators=(",", ":")) + "\n")
    urls = {locale: asset_url(f"/assets/locales/{locale}.json") for locale in LOCALES}
    partials = {key: (T / "partials" / f"{key.lower()}.html").read_text()
                for key in ("HEADER", "FOOTER", "HERO", "EXPERIMENTS")}
    for locale, messages in catalogs.items():
        directory = DIST if locale == "en" else DIST / "tr"
        directory.mkdir(exist_ok=True)
        config = json.dumps({"locale": locale, "messages": messages, "urls": urls, "origin": ORIGIN, "basePath": BASE_PATH, "routes": LOCALES}, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")
        values = dict(partials, LANG=locale, LANGUAGE_SWITCHER=language_switcher(locale, messages), LOCALE_DATA='<script type="application/json" id="locale-data">' + config + '</script>', INITIAL_WORD=messages["visual.defaultWord"], CONTACT_SUBJECT=quote(messages["site.contact.subject"]))
        for template, filename, error in [("home.html", "index.html", False), ("404.html", "404.html", True)]:
            values["HEAD"] = head(messages, locale, error)
            (directory / filename).write_text(render((T / template).read_text(), values, messages, locale))
    retired = DIST / "work"
    if retired.exists():
        shutil.rmtree(retired)
    alternate_links = ''.join(f'<xhtml:link rel="alternate" hreflang="{locale}" href="{ORIGIN + path}"/>' for locale, path in [*LOCALES.items(), ("x-default", LOCALES["en"])])
    (DIST / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' + ''.join(f'<url><loc>{ORIGIN + path}</loc>{alternate_links}</url>' for path in LOCALES.values()) + '</urlset>')
    (DIST / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {ORIGIN}{BASE_PATH}/sitemap.xml\n")
    print(f"Rendered EN {LOCALES['en']} and TR {LOCALES['tr']}, localized 404s, versioned locale catalogs and multilingual SEO.")


if __name__ == "__main__":
    main()
