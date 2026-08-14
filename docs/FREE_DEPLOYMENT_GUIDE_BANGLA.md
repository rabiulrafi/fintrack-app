# FinTrack (ফিনট্র্যাক) - ১০০% ফ্রি ক্লাউড ডিপ্লয়মেন্ট গাইড
## Render.com এ ১-ক্লিকে ফুল-স্ট্যাক প্রজেক্ট লাইভ করার নিয়মাবলী

---

## 🎯 যা যা ফ্রিতে লাইভ হবে:
1. **React Frontend (UI):** বিশ্বব্যাপী দ্রুতগতির ফ্রি হোস্টিং (`https://fintrack-frontend.onrender.com`)
2. **FastAPI Backend (API):** অটো-স্কেলিং পাইথন ওয়েব সার্ভিস (`https://fintrack-backend.onrender.com`)
3. **PostgreSQL Database:** ক্লাউড ডাটাবেজ (অটো-মাইগ্রেশন ও ডেমো ডাটা সহ)

---

## 📋 ধাপ ১: GitHub-এ প্রজেক্ট আপলোড করুন

১. আপনার কম্পিউটারের টার্মিনালে প্রজেক্ট ফোল্ডারে যান:
```cmd
cd "e:\Antigravity Projects\First APP\Templates\income-expense-tracker"
```

২. গিট ইনিশিয়ালাইজ ও কমিট করুন:
```cmd
git init
git add .
git commit -m "feat: complete FinTrack app with Render blueprint"
```

৩. [GitHub.com](https://github.com) এ গিয়ে একটি **New Repository** তৈরি করুন (যেমন: `fintrack-app`)।

৪. আপনার লোকাল কোড গিটহাবে পুশ করুন:
```cmd
git branch -M main
git remote add origin https://github.com/<your-username>/fintrack-app.git
git push -u origin main
```

---

## 🚀 ধাপ ২: Render.com এ ১-ক্লিকে ডিপ্লয় করুন

১. ব্রাউজারে [dashboard.render.com](https://dashboard.render.com) এ যান এবং আপনার GitHub অ্যাকাউন্ট দিয়ে **Sign In** করুন।

২. ড্যাশবোর্ডের উপরে ডানে **New +** বাটনে ক্লিক করে **Blueprint** সিলেক্ট করুন।

৩. আপনার GitHub এর `fintrack-app` রিপোজিটরিটি সিলেক্ট করুন এবং **Connect** এ ক্লিক করুন।

৪. Render স্বয়ংক্রিয়ভাবে প্রজেক্টের `render.yaml` ফাইলটি পড়ে নিচের ৩টি সার্ভিস একসাথে সাজিয়ে নেবে:
   * **`fintrack-db`** (Free PostgreSQL Database)
   * **`fintrack-backend`** (Free FastAPI Web Service)
   * **`fintrack-frontend`** (Free Static Site)

৫. নিচে **Apply** বাটনে ক্লিক করুন! 🎉

---

## ⏱️ ডিপ্লয় সম্পন্ন হওয়া পর্যন্ত অপেক্ষা করুন (৩-৫ মিনিট)

* Render স্বয়ংক্রিয়ভাবে ডাটাবেজ তৈরি করবে, ব্যাকএন্ড বিল্ড করবে এবং ফ্রন্টএন্ড প্যাকেজ করে লাইভ লিংক তৈরি করে দেবে।
* বিল্ড শেষ হলে আপনার ফ্রন্টএন্ড সার্ভিস ওপেন করলে একটি লাইভ লিংক দেখতে পাবেন (যেমন: `https://fintrack-frontend-xxxx.onrender.com`)।

---

## 🔑 লাইভ অ্যাপে লগইন তথ্য:
* **ডেমো ইমেইল:** `demo@example.com`
* **পাসওয়ার্ড:** `Demo@12345`

---

## 💡 বিকল্প: Vercel এ ফ্রন্টএন্ড হোস্ট করতে চাইলে (Option B)

যদি আপনি ফ্রন্টএন্ডটি [Vercel.com](https://vercel.com) এ রাখতে চান:
1. Vercel এ লগইন করে **Add New Project** দিন এবং আপনার রিপোজিটরি ইমপোর্ট করুন।
2. **Root Directory:** নির্বাচন করুন `frontend`।
3. **Environment Variables** এ যোগ করুন:
   * `VITE_API_BASE_URL` = আপনার ব্যাকএন্ডের Render লাইভ URL (যেমন: `https://fintrack-backend.onrender.com/api/v1`)
4. **Deploy** বাটনে ক্লিক করুন!
