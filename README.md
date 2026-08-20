# 🏫 RADIAN CRM — O'quv Markazi Boshqaruv Tizimi

> **KELAJAK BIZ BILAN** 🟢

![Radian](https://img.shields.io/badge/Radian-O'quv%20Markazi-202B4D?style=for-the-badge&logo=googleclassroom&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📌 Radian CRM nima?

**Radian CRM** — bu o'quv markazlarni to'liq boshqarish uchun yaratilgan zamonaviy CRM tizimi.  
Bitta platformada: o'quvchilar, ustozlar, guruhlar, kurslar, davomat, to'lovlar, imtihonlar va hisobotlar — hammasi bir joyda.

### 🎯 Asosiy maqsad

O'quv markaz egasi yoki direktori **bir dashboard'dan** butun markazning ishlashini nazorat qilishi kerak:
- Kim dars beradi? ✅
- Kim qarzdor? ⚠️
- Bugun nechta o'quvchi keldi? 📊
- Qaysi guruh to'liq? 👥

---

## ✨ Imkoniyatlar

### 👨‍💼 Admin Dashboard
- 📊 Real-vaqtda statistika (o'quvchilar, ustozlar, guruhlar, daromad)
- 📈 Oylik daromad grafigi
- ⚠️ Qarzdorlar jadvali
- 🔔 Bildirishnomalar

### 👨‍🎓 O'quvchilar
- 📋 To'liq ro'yxat (login/parol bilan)
- 🔍 Qidiruv va filtrlar (Faol / Qarzdor / Guruh bo'yicha)
- ✅ Davomat statistikasi
- 💰 To'lov holati

### 🧑‍🏫 O'qituvchilar
- 👥 Guruhlar va o'quvchilar soni
- 💰 Oylik maosh
- 🔐 Login/parol

### 📚 14 ta fan/kurs
| # | Fan | Guruhlar | O'quvchilar |
|---|-----|----------|-------------|
| 1 | 🧮 Matematika | 8 | 186 |
| 2 | 🇬🇧 Ingliz tili | 6 | 142 |
| 3 | 🎓 IELTS | 5 | 98 |
| 4 | 📜 CEFR | 3 | 54 |
| 5 | ⚛️ Fizika | 4 | 78 |
| 6 | 🧪 Kimyo | 3 | 56 |
| 7 | 🧬 Biologiya | 3 | 62 |
| 8 | 📖 Ona tili | 2 | 38 |
| 9 | 🏛 Tarix | 2 | 42 |
| 10 | ⚖️ Huquqshunoslik | 1 | 18 |
| 11 | 🇷🇺 Rus tili | 2 | 34 |
| 12 | 🧠 Prezident maktabi | 2 | 28 |
| 13 | ♟️ Shaxmat | 1 | 22 |
| 14 | 💻 IT | 2 | 36 |

### 📅 Dars jadvali
- 6 kunlik jadval
- Xona va vaqt bilan
- Guruh va ustoz ko'rsatilgan

### ✅ Davomat
- Keldi / Kelmadi / Kechikdi
- Foiz hisoblash
- Guruh bo'yicha

### 💰 Moliya
- To'lovlar tarixi
- Qarzdorlik hisoblash
- Oylik daromad
- Xarajatlar

### 📝 Imtihonlar
- Imtihon qo'shish
- Javoblar kiritish
- Ota-onaga xabar

### ⚙️ Sozlamalar
- Academy nomi, manzili, telefoni
- Audit logs

---

## 🔐 Rollar

| Rol | Emoji | Vazifa |
|-----|-------|--------|
| **Super Admin** | 👑 | Butun platforma |
| **Admin** | 🏢 | Markaz direktori |
| **Buxgalter** | 🧮 | Moliya va to'lovlar |
| **O'qituvchi** | 🧑‍🏫 | Dars va ta'lim |
| **O'quvchi** | 👨‍🎓 | O'z o'qishi |
| **Ota-ona** | 👨‍👩‍👦 | Farzand nazorati |

---

## 🎨 Dizayn tizimi

| Rang | HEX | Ishlatilishi |
|------|-----|-------------|
| 🔵 Navy | `#202B4D` | Sidebar, asosiy matn |
| 🟢 Green | `#62D17B` | Success, active, progress |
| 🟡 Gold | `#F3C94B` | Premium accent |
| ⚪ Background | `#F7F8FA` | Sahifa fonu |
| ⬜ Card | `#FFFFFF` | Cardlar |

---

## 🛠 Texnologiyalar

| Qatlam | Texnologiya |
|--------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (Access + Refresh Token) |
| Bot | Telegram Bot API (Mini App) |
| Deploy | Vercel + Railway + Supabase |

---

## 🚀 O'rnatish

```bash
# 1. Repo'ni clone qilish
git clone https://github.com/anvarovmuhammadamin011-ops/Radiancrm.git
cd Radiancrm

# 2. Backend o'rnatish
cd backend
npm install
cp .env.example .env   # Database URL ni kiriting
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev

# 3. Preview (buildsiz)
# .freebuff/preview.html faylini brauzerda oching
```

---

## 📂 Loyiha tuzilmasi

```
Radiancrm/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/               # JWT autentifikatsiya
│   │   ├── students/           # O'quvchilar
│   │   ├── teachers/           # O'qituvchilar
│   │   ├── courses/            # Kurslar
│   │   ├── groups/             # Guruhlar
│   │   ├── attendance/         # Davomat
│   │   ├── payments/           # To'lovlar
│   │   ├── exams/              # Imtihonlar
│   │   └── dashboard/          # Dashboard
│   └── prisma/
│       └── schema.prisma       # Database modeli
├── .freebuff/
│   ├── preview.html            # CRM Demo (705 lines)
│   ├── test-contract.js        # Test suite (109 assertions)
│   └── explain.html            # Arxitektura tushuntirishi
└── README.md
```

---

## 📱 Telegram Bot

Radian CRM Telegram Mini App sifatida ham ishlaydi:

```
/start
├── 📚 Kurslar
├── 💰 Narxlar
├── 🎓 Sinov darsi
├── 👨‍💼 Operator
└── 📅 Jadval
```

---

## 📍 Manzil

```
📍 Andijon viloyati, Baliqchi tumani, Chinobod shaharchasi
📞 +998 91 064 11 44
📞 +998 95 064 11 44
```

---

## 📊 Test natijalari

```bash
cd .freebuff && node test-contract.js
# === RESULTS: 109 passed, 0 failed ===
```

| Test | Natija |
|------|--------|
| Config completeness | ✅ 30/30 |
| Page dispatch | ✅ ~30/30 |
| Sidebar single-active | ✅ 6/6 |
| Student filters | ✅ 4/4 |
| Logout reset | ✅ 4/4 |
| Dashboard stats | ✅ 6/6 |
| Render functions | ✅ 18/18 |

---

## 📄 Litsensiya

MIT License — Erkin ishlatish mumkin.

---

**Radian O'quv Markazi** — *KELAJAK BIZ BILAN* 🟢
