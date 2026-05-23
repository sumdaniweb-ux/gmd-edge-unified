#!/usr/bin/env python3
import sys
from core_loader import load_api_key, scan_directories

def main():
    print("🚀 APKI پروجیکٹ شروع...")
    try:
        api_key = load_api_key()
        print(f"✅ API Key لوڈ: {api_key[:4]}****{api_key[-4:]}")
        files = scan_directories("*.xml")
        print(f"📁 کل {len(files)} فائلز ملیں:")
        for f in files[:5]:
            print(f"   • {f}")
        if len(files) > 5:
            print(f"   ... اور {len(files) - 5} مزید")
        print("✅ سسٹم تیار۔ اگلا مرحلہ آپ کی ہدایت پر۔")
    except Exception as e:
        print(f"❌ خرابی: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()