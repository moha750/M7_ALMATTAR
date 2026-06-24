# بورتفوليو محمد بن إسماعيل — «مُبدِعٌ واحد، خمسُ حِرَف»

موقع شخصي يعرض أعمال مبدع خليجي متعدّد التخصصات (تصميم جرافيك · مونتاج · موشن جرافيك · برمجة · تعليق صوتي)، مع **لوحة تحكم** لإدارة الأعمال، مبنيٌّ على **Supabase**.

> الهوية البصرية «الهوية الواحدة بخمسة أوجه» — خيط ذهبي يجمع خمس حِرَف، بألوان مستوحاة مباشرةً من الشعار والصورة الشخصية.

---

## الستاك التقني

| الطبقة | التقنية |
|---|---|
| الإطار | Next.js 16 (App Router) + TypeScript |
| التنسيق | Tailwind CSS v4 (تصميم Tokens داخل `globals.css`) |
| قاعدة البيانات/المصادقة/التخزين | Supabase (Postgres · Auth · Storage · RLS) عبر `@supabase/ssr` |
| الحركة | Framer Motion |
| الأيقونات | lucide-react |
| الاتجاه | RTL · عربي (`lang="ar"`, `dir="rtl"`) |
| النشر | Vercel (مقترح) |

---

## التشغيل محليًّا

```bash
npm install
npm run dev
```

ثم افتح <http://localhost:3000>.

> **ملاحظة:** افتح الموقع في متصفّح حديث (Chrome/Edge محدّث). Tailwind v4 يستخدم ميزات CSS حديثة (cascade layers، `color-mix`) لا تدعمها المتصفّحات القديمة جدًّا.

### أوامر أخرى

```bash
npm run build     # بناء الإنتاج
npm run start     # تشغيل بناء الإنتاج
npm run lint      # فحص ESLint
npx tsc --noEmit  # فحص الأنواع

# قاعدة البيانات (تتطلب .env.local مضبوطًا)
npm run db:setup  # إنشاء الجداول + RLS + التخزين + البيانات الأولية
npm run db:admin  # إنشاء/تحديث حساب الأدمن
node scripts/db-verify.mjs  # التحقق من السلامة وسلوك RLS
```

---

## ربط Supabase (المرحلة القادمة)

1. أنشئ مشروعًا على [supabase.com](https://supabase.com).
2. انسخ `.env.local.example` إلى `.env.local` واملأ القيم من **Project Settings → API**:
   ```bash
   cp .env.local.example .env.local
   ```
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
3. أعد تشغيل خادم التطوير. (قبل ضبط هذه القيم، يتخطّى الـ proxy التحقق من الجلسة بأمان فلا يتعطّل الموقع.)

سيُضاف لاحقًا: مخطط الجداول، سياسات RLS، أقسام التخزين (buckets)، وحساب الأدمن.

---

## بنية المشروع

```
src/
├── app/
│   ├── layout.tsx        # RTL + الخطوط العربية (next/font) + الميتاداتا
│   ├── globals.css       # نظام التصميم: الألوان والخطوط (Tailwind v4 @theme)
│   └── page.tsx          # الصفحة الرئيسية (تجميع الأقسام)
├── components/
│   ├── site-header.tsx   # الرأس + القائمة
│   ├── hero.tsx          # الهيرو + سويتشر التخصصات + الخيط الذهبي
│   └── site-footer.tsx   # التذييل
├── lib/
│   ├── disciplines.ts    # التخصصات الخمسة (ثابت مبدئيًّا → سيُقرأ من Supabase)
│   └── supabase/
│       ├── client.ts     # عميل المتصفّح
│       ├── server.ts     # عميل الخادم (Server Components/Actions)
│       └── middleware.ts # تحديث الجلسة + حماية /admin
└── proxy.ts              # ملف الاصطلاح (Next 16: proxy بدل middleware)
public/brand/
├── logo.png              # الشعار الذهبي
└── profile.jpg           # الصورة الشخصية
```

---

## نظام الألوان

| الاسم | المتغيّر | Hex |
|---|---|---|
| ذهبي عتيق | `--color-gold` | `#D2A45C` |
| كراميل محروق | `--color-gold-deep` | `#B07E3A` |
| كريمي دافئ | `--color-cream` | `#E9E3D7` |
| كريمي فاتح | `--color-parchment` | `#F4EFE6` |
| فحمي بنّي | `--color-espresso` | `#1C1A17` |
| بنّي دخاني | `--color-walnut` | `#2A2621` |
| رمادي طيني | `--color-taupe` | `#8A8073` |

الخطوط: **Aref Ruqaa** (عناوين كبرى) · **Tajawal** (فرعية) · **IBM Plex Sans Arabic** (المتن) · **Space Grotesk** (لاتيني/تقني).

---

## خارطة الطريق

- [x] **المرحلة ١ — التهيئة:** Next.js + Tailwind + RTL + الخطوط + الألوان + عملاء Supabase + هيرو الواجهة.
- [x] **المرحلة ٢ — قاعدة البيانات:** الجداول، RLS، buckets التخزين، حساب الأدمن، وربط الموقع بالبيانات الحيّة.
- [ ] **المرحلة ٣ — الواجهة العامة:** المعرض القابل للتصفية، Case Studies، الشوريل، ريل التعليق الصوتي، الثيمان والحركة.
- [ ] **المرحلة ٤ — لوحة التحكم:** الدخول الآمن، CRUD، رفع الوسائط، الإدارة الكاملة.
- [ ] **المرحلة ٥ — المحتوى والنشر:** الأعمال الحقيقية، ضبط الأداء، النشر على Vercel.
