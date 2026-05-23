import os
import sys
from pathlib import Path
from dotenv import load_dotenv

def load_api_key():
    env_file = Path('.env')
    if not env_file.exists():
        print("❌ .env فائل نہیں ملی۔ .env.example کو کاپی کر کے .env بنائیں اور API Key ڈالیں۔")
        sys.exit(1)
    load_dotenv(env_file)
    api_key = os.getenv('API_KEY')
    if not api_key or api_key == 'your_actual_api_key_here':
        print("❌ API Key خالی یا ڈیفالٹ ہے۔ .env میں اصلی Key ڈالیں۔")
        sys.exit(1)
    return api_key

def scan_directories(pattern="*.xml"):
    roots = [Path.cwd()]
    mobile_root = Path('/storage/emulated/0')
    if mobile_root.exists():
        roots.extend([mobile_root / 'Download', mobile_root / 'Documents', mobile_root / 'APKI_Backup'])
    found = []
    for r in roots:
        if r.exists():
            found.extend(list(r.rglob(pattern)))
    return list(set(found))