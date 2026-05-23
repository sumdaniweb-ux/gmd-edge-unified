# APKI Unified Project

یہ پروجیکٹ موبائل اور ڈیسک ٹاپ دونوں ماحول میں API Keys کو محفوظ طریقے سے استعمال کرتا ہے۔

## 🚀 استعمال کا طریقہ

1. `.env.example` کو کاپی کر کے `.env` بنائیں
2. `.env` میں اپنی API Key ڈالیں
3. انسٹال کریں: `pip install -r requirements.txt`
4. چلائیں: `python main.py`

## 📁 فولڈر اسٹرکچر

- `main.py` - مرکزی فائل
- `core_loader.py` - API Key اور فائلز لوڈ کرنے والا
- `.env` - آپ کی اصلی API Key (GitHub پر نہیں جائے گی)
- `requirements.txt` - Python packages

## 🔐 سیکیورٹی

- `.env` فائل کبھی GitHub پر اپلوڈ نہ کریں
- `.gitignore` پہلے سے موجود ہے جو `.env` کو روکتی ہے