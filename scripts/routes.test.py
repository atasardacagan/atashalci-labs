"""Focused local routing/build contract checks; starts its own ephemeral server.

Run after building: python3 scripts/routes.test.py
This verifies the preview's contract, not the unpublished hosting configuration.
"""
from functools import partial
import hashlib
import http.client
from http.server import ThreadingHTTPServer
import json
from pathlib import Path
from threading import Thread
import unittest

from build import unique_object, validate_catalogs
from serve import DIST, PreviewHandler


class QuietHandler(PreviewHandler):
    def log_message(self, format, *args):
        pass


class PreviewRoutes(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(DIST)))
        cls.thread = Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def request(self, path, method='GET', headers=None):
        connection = http.client.HTTPConnection(*self.server.server_address, timeout=5)
        try:
            connection.request(method, path, headers=headers or {})
            response = connection.getresponse()
            return response.status, response.headers, response.read()
        finally:
            connection.close()

    def test_localized_homepages_and_refresh(self):
        for path, language in [('/', 'en'), ('/tr', 'tr'), ('/?campaign=lab', 'en'), ('/tr?campaign=lab', 'tr')]:
            with self.subTest(path=path):
                status, headers, content = self.request(path)
                self.assertEqual(status, 200)
                self.assertIn(f'<html lang="{language}">'.encode(), content)
                self.assertEqual(content, self.request(path)[2])
                self.assertEqual(headers.get_all('Cache-Control'), ['no-cache'])

    def test_aliases_redirect_once_and_keep_query(self):
        for path, target in [('/index.html', '/'), ('/tr/', '/tr'), ('/tr/index.html', '/tr')]:
            for query in ['', '?campaign=lab%20test&ref=one']:
                with self.subTest(path=path + query):
                    status, headers, content = self.request(path + query)
                    self.assertEqual(status, 301)
                    self.assertEqual(headers['Location'], target + query)
                    self.assertEqual(content, b'')
                    self.assertEqual(self.request(headers['Location'])[0], 200)

    def test_missing_routes_return_localized_real_404(self):
        for path, language in [('/missing', 'en'), ('/tr/missing', 'tr'), ('/tr%2Fmissing', 'tr'), ('/work/retired', 'en')]:
            with self.subTest(path=path):
                status, headers, content = self.request(path)
                self.assertEqual(status, 404)
                self.assertIn(f'<html lang="{language}">'.encode(), content)
                self.assertIn(b'<meta name="robots" content="noindex">', content)
                self.assertEqual(headers.get_all('Cache-Control'), ['no-cache'])

    def test_head_has_get_status_and_length_without_body(self):
        for path in ['/', '/tr', '/missing', '/tr/missing', '/assets/i18n.js']:
            with self.subTest(path=path):
                get_status, get_headers, get_content = self.request(path)
                status, headers, content = self.request(path, 'HEAD')
                self.assertEqual(status, get_status)
                self.assertEqual(headers['Content-Length'], str(len(get_content)))
                self.assertEqual(headers['Content-Type'], get_headers['Content-Type'])
                self.assertEqual(content, b'')

    def test_private_paths_and_directories_are_not_exposed(self):
        for path in ['/_headers', '/.git/config', '/.openai/hosting.json', '/assets/', '/assets/locales/', '/tr/.hidden']:
            with self.subTest(path=path):
                status, _, content = self.request(path)
                self.assertEqual(status, 404)
                self.assertNotIn(b'Directory listing for', content)

    def test_versioned_assets_have_one_matching_cache_policy(self):
        for name in ['i18n.js', 'site.css', 'locales/en.json', 'locales/tr.json']:
            content = (DIST / 'assets' / name).read_bytes()
            digest = hashlib.sha256(content).hexdigest()[:10]
            for query, policy in [('', 'no-cache'), ('?v=wrong', 'no-cache'), ('?v=' + digest, 'public, max-age=31536000, immutable'), ('?v=' + digest + '&v=wrong', 'no-cache')]:
                with self.subTest(name=name, query=query):
                    status, headers, body = self.request('/assets/' + name + query)
                    self.assertEqual(status, 200)
                    self.assertEqual(body, content)
                    self.assertEqual(headers.get_all('Cache-Control'), [policy])

    def test_revalidation_preserves_security_and_cache_headers(self):
        _, initial, _ = self.request('/assets/i18n.js')
        status, headers, content = self.request('/assets/i18n.js', headers={'If-Modified-Since': initial['Last-Modified']})
        self.assertEqual(status, 304)
        self.assertEqual(headers.get_all('Cache-Control'), ['no-cache'])
        self.assertEqual(headers['X-Content-Type-Options'], 'nosniff')
        self.assertEqual(content, b'')

    def test_security_headers_apply_to_both_languages_and_errors(self):
        for path in ['/', '/tr', '/missing', '/tr/missing', '/assets/i18n.js']:
            with self.subTest(path=path):
                _, headers, _ = self.request(path)
                self.assertEqual(headers['X-Content-Type-Options'], 'nosniff')
                self.assertEqual(headers['Referrer-Policy'], 'strict-origin-when-cross-origin')
                self.assertEqual(headers['Permissions-Policy'], 'camera=(), microphone=(), geolocation=()')


class CatalogBuildContract(unittest.TestCase):
    def test_duplicate_json_keys_are_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Duplicate locale key'):
            json.loads('{"copy":"first","copy":"second"}', object_pairs_hook=unique_object)
        with self.assertRaisesRegex(ValueError, 'Duplicate locale key'):
            json.loads('{"copy":{"label":"first","label":"second"}}', object_pairs_hook=unique_object)

    def test_missing_keys_are_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Locale keys differ'):
            validate_catalogs({'en': {'copy': 'Hello'}, 'tr': {}})

    def test_different_ui_shapes_are_rejected(self):
        for translated in ['Text', ['One'], [{'label': 'One'}, {'label': 'Two'}]]:
            with self.subTest(translated=translated), self.assertRaisesRegex(ValueError, 'Locale (type|list length) mismatch'):
                validate_catalogs({'en': {'copy': [{'label': 'One'}]}, 'tr': {'copy': translated}})

    def test_interpolation_must_remain_usable_in_both_languages(self):
        validate_catalogs({'en': {'copy': '{count} source(s)'}, 'tr': {'copy': '{count} kaynak'}})
        with self.assertRaisesRegex(ValueError, 'Locale placeholders differ'):
            validate_catalogs({'en': {'copy': '{count} source(s)'}, 'tr': {'copy': '{number} kaynak'}})


if __name__ == '__main__':
    unittest.main(verbosity=2)
