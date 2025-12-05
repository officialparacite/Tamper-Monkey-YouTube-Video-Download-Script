#!/usr/bin/env python3

from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import subprocess
import os

PORT = 9999
DOWNLOAD_PATH = "/home/mortrok/Downloads"   # <-- CHANGE THIS

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/run":
            params = parse_qs(parsed.query)
            cmd = params.get("cmd", [""])[0]

            if not cmd.startswith("yt-dlp"):
                self._send(403, b"Forbidden: Only yt-dlp allowed\n")
                return

            # Add output directory
            fullcmd = f'{cmd} -o "{DOWNLOAD_PATH}/%(title)s.%(ext)s"'

            print(f"[RUN] {fullcmd}")

            subprocess.Popen(fullcmd, shell=True)

            self._send(200, b"OK\n")
            return

        self._send(404, b"Not found\n")

    def _send(self, code, body):
        self.send_response(code)
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    print(f"yt-dlp server on port {PORT}")
    print(f"Download path: {DOWNLOAD_PATH}")
    HTTPServer(("127.0.0.1", PORT), Handler).serve_forever()

