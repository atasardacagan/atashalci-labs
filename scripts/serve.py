"""Local static preview with branded 404s and the repository's response headers.

Run `python3 scripts/serve.py --port 4187`. This is a development preview,
not an Internet-facing production server or a substitute for hosting checks.
"""
from argparse import ArgumentParser
from fnmatch import fnmatchcase
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit
import hashlib

DIST = Path(__file__).resolve().parents[1] / "dist"


def response_rules():
    rules = []
    source = DIST / "_headers"
    if not source.exists():
        return rules
    for line in source.read_text().splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if line.startswith("/"):
            rules.append((line.strip(), []))
        elif line[0].isspace() and ":" in line and rules:
            name, value = line.strip().split(":", 1)
            rules[-1][1].append((name.strip(), value.strip()))
    return rules


class PreviewHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        decoded = unquote(urlsplit(path).path)
        candidate = Path(super().translate_path(path)).resolve()
        if (not candidate.is_relative_to(DIST) or
                any(part.startswith(".") for part in decoded.split("/") if part) or
                candidate.name == "_headers"):
            return str(DIST / ".unavailable")
        return str(candidate)

    def send_head(self):
        request = urlsplit(self.path)
        canonical = {"/index.html": "/", "/tr/": "/tr", "/tr/index.html": "/tr"}.get(request.path)
        if canonical:
            self.send_response(301)
            self.send_header("Location", canonical + ("?" + request.query if request.query else ""))
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None
        if request.path == "/tr":
            original = self.path
            self.path = "/tr/index.html" + ("?" + request.query if request.query else "")
            try:
                return super().send_head()
            finally:
                self.path = original
        return super().send_head()

    def list_directory(self, path):
        self.send_error(404)
        return None

    def end_headers(self):
        request = urlsplit(self.path)
        for pattern, headers in response_rules():
            if fnmatchcase(request.path, pattern):
                for name, value in headers:
                    # The local preview owns cache validation below. Emitting a
                    # second policy can conflict with no-cache on shared modules.
                    if name.lower() != "cache-control":
                        self.send_header(name, value)
        # Only content-matching, versioned assets may be cached immutably.
        cache = "no-cache"
        if request.path.startswith("/assets/"):
            file = Path(self.translate_path(self.path))
            version = parse_qs(request.query).get("v", [])
            if file.is_file() and version == [hashlib.sha256(file.read_bytes()).hexdigest()[:10]]:
                cache = "public, max-age=31536000, immutable"
        self.send_header("Cache-Control", cache)
        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        page = DIST / ("tr/404.html" if unquote(urlsplit(self.path).path).startswith("/tr/") else "404.html")
        if code != 404 or not page.is_file():
            return super().send_error(code, message, explain)
        content = page.read_bytes()
        self.send_response(404, "Not Found")
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(content)


def main():
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=4187)
    parser.add_argument("--bind", default="127.0.0.1")
    args = parser.parse_args()
    handler = partial(PreviewHandler, directory=str(DIST))
    with ThreadingHTTPServer((args.bind, args.port), handler) as server:
        print(f"Preview: http://{args.bind}:{args.port}/", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
