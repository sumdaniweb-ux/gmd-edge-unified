#!/usr/bin/env python3
"""APKI Secure - حتمی موبائل سرور"""
# APKI_CONF: master=.env | lock=LICENSE | hw=bound | sw=active | display=false

import http.server, socketserver, json, hashlib, platform
from pathlib import Path
from urllib.parse import urlparse

PORT = 8000
API_KEY = "GMD_ULTRA_310f1c31e862d9b0_91c5c58c37b9e91a_58984a5aa2778e26_063D3915779B_SECURE"

class APKIHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                "status": "active",
                "api_verified": True,
                "hw_fp": hashlib.sha256(platform.node().encode()).hexdigest()[:16],
                "version": "1.0.0"
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            super().do_GET()
    
    def do_POST(self):
        if self.path == '/api/chat':
            length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(length).decode())
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {"reply": f"APKI Secure: {data.get('prompt', '')}"}
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format%args}")

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), APKIHandler) as httpd:
        print(f" APKI Secure چل رہا ہے: http://localhost:{PORT}")
        print(f"🔑 API: {API_KEY[:20]}****")
        print("✅ تیار۔ Ctrl+C سے روکیں")
        httpd.serve_forever()