// يضيف/يحدّث الأعمال في جدول projects عبر مفتاح الخدمة (upsert على slug).
// الاستخدام: node scripts/seed-works.mjs
// لا يلمس «دربك خضر» (مسودة غير منشورة) ولا صور الأغلفة المرفوعة.
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("✗ تحتاج NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY في .env.local");
  process.exit(1);
}

const T = "[التحدي]";

// المختارات (is_featured) تظهر كرحلات كاملة في الرئيسية، والباقي في الأرشيف.
const WORKS = [
  {
    slug: "خلف-الأبواب", title_ar: "خلف الأبواب", category: "editing", is_featured: true,
    subtitle_ar: "حملة «ما فاتك شي» لنادي أدِيب",
    summary_ar: "لقاء تلفزيوني ساخر ضيفه باب، لحملة التسجيل المفتوح طوال السنة.",
    challenge_ar: "فتح النادي التسجيل طوال السنة. كيف نقول للطلاب إن الباب لم يُغلق، بطريقة لا ينسونها؟",
    idea_ar: "لقاء تلفزيوني ساخر، ضيفه الباب نفسه. ومن أدرى منه بأنه ما زال مفتوحًا؟",
    execution_ar: "ممثل حقيقي يؤدي الدور بصوته وحركته، ثم باب له أطراف مكانه عبر عشرين لقطة مولّدة بالذكاء الاصطناعي، وتنظيف دقيق في After Effects.",
    roles_ar: ["الفكرة", "الإخراج", "المونتاج", "المؤثرات البصرية", "الذكاء الاصطناعي"],
  },
  {
    slug: "منصة-أديب", title_ar: "منصة أدِيب", category: "code", is_featured: true,
    subtitle_ar: "المنصة الرقمية لنادي أدِيب",
    summary_ar: "من موقع تعريفي إلى منصة شبه متكاملة.",
    challenge_ar: T,
    idea_ar: "أن تُروى حكاية النادي بالتمرير في أربعة فصول، وأن يصير للنادي بيت رقمي: إذاعة، وأرشيف، وهوية تتحرك.",
    execution_ar: "إذاعة وبودكاست بخلاصة RSS، وحكاية النادي في أربعة فصول سينمائية، وهوية حركية من الشعار المتحرك حتى شاشة التحميل.",
    roles_ar: ["التصميم", "البرمجة", "الهوية الحركية", "Next.js", "Supabase"],
  },
  {
    slug: "مساحة-أثر", title_ar: "مساحة أثر", category: "code", is_featured: true,
    subtitle_ar: "منصة منتديات موظفي وزارة الموارد البشرية والتنمية الاجتماعية",
    summary_ar: "مثل الأندية الطلابية في الجامعات، لكن لموظفي الوزارة.",
    challenge_ar: T,
    idea_ar: "يختار الموظف منتدى يناسب مهاراته، وتنشئ إدارة المبادرة منتديات بتخصصات مختلفة وتديرها، كل منتدى نادٍ قائم بذاته.",
    execution_ar: "منصة بالعربية والإنجليزية، دخولها مقصور على بريد الوزارة، بهوية خضراء وذهبية تتبع شعار مساحة أثر.",
    roles_ar: ["المشاركة في التأسيس", "التصميم", "البرمجة"],
  },
  {
    slug: "ركضة-وطن", title_ar: "ركضة وطن", category: "code", is_featured: true,
    subtitle_ar: "لعبة عدو ثلاثية الأبعاد لليوم الوطني",
    summary_ar: "لعبة جوال بلا نهاية، تُلعب من المتصفح مباشرة.",
    challenge_ar: T,
    idea_ar: "لعبة عدو لا نهائية بروح اليوم الوطني، على الجوال ومن غير تحميل.",
    execution_ar: "لعبة ثلاثية الأبعاد منشورة على GitHub Pages، والخطوة القادمة مسابقة بتسجيل ولوحة صدارة.",
    roles_ar: ["الفكرة", "التصميم", "البرمجة"],
    project_url: "https://moha750.github.io/rakdat-watan-game",
  },
  {
    slug: "مخلدات", title_ar: "مُخلّدات", category: "voice", is_featured: true,
    subtitle_ar: "بودكاست تاريخي",
    summary_ar: "كل حلقة حضارة واحدة، والتاريخ عمودها الفقري.",
    challenge_ar: T,
    idea_ar: "حكاية لكل حضارة، بمعلومات مختصرة إلى الجوهر، وسرد يجعل المستمع يتخيل الأحداث.",
    execution_ar: "الحلقة الأولى «حين سقطت روما»: من تأسيس روما حتى سقوطها عام ٤٧٦.",
    roles_ar: ["الإخراج"],
  },
  {
    slug: "ديبو", title_ar: "ديبو", category: "graphic", is_featured: true,
    subtitle_ar: "الشخصية الممثلة لنادي أدِيب",
    summary_ar: "وجه النادي وصوته: شخصية تبطل فيديوهاته، ومساعد ذكي يحمل اسمها.",
    challenge_ar: T,
    idea_ar: "أن يكون للنادي شخصية يعرفها الطلاب، تظهر في محتواه وتجيب عن أسئلتهم.",
    execution_ar: "شخصية ثلاثية الأبعاد بأربعة وعشرين تعبيرًا ولقطات بزوايا متعددة، بطلة فيديو اليوم الوطني، ومساعد ذكي بالاسم نفسه.",
    roles_ar: ["تصميم الشخصية", "الذكاء الاصطناعي"],
  },

  // --- الأرشيف ---
  {
    slug: "فيديو-اليوم-الوطني", title_ar: "فيديو اليوم الوطني", category: "editing",
    subtitle_ar: "نادي أدِيب · بطولة ديبو",
    summary_ar: "ديبو يحمل العلم ويتوسط الصفوف: محاط بالأمان وسط بلده.",
    roles_ar: ["الفكرة", "الذكاء الاصطناعي"],
  },
  {
    slug: "أديب-ألمى", title_ar: "أدِيب × ألمى", category: "editing",
    subtitle_ar: "إعلان شراكة",
    summary_ar: "إعلان الشراكة بين نادي أدِيب ومقهى ألمى الداعم لفعاليات النادي.",
  },
  {
    slug: "منعطف", title_ar: "منعطف", category: "voice",
    subtitle_ar: "بودكاست إذاعة أدِيب",
    summary_ar: "إنتاج الحلقات ومحتواها، وهوية صوتية بُنيت من لحن دندنته.",
    roles_ar: ["الإنتاج", "الهوية الصوتية"],
  },
  {
    slug: "مرمى", title_ar: "مرمى", category: "code",
    subtitle_ar: "منصة حجز وولاء للملاعب والمرافق الرياضية",
    summary_ar: "بدأت نظام حجز لملعب والدي، وصارت منتجًا لكل المرافق الرياضية في السعودية.",
    roles_ar: ["الفكرة", "المنتج", "البرمجة"],
  },
  {
    slug: "loglink", title_ar: "LogLink", category: "code",
    subtitle_ar: "تتبّع رسوم تأخير الحاويات في الموانئ السعودية",
    summary_ar: "موقع بواجهة ثلاثية الأبعاد تُروى بالتمرير، ولوحة تحكم عربية، وقصة عرض لهاكاثون فريق لوجيتكثون.",
    roles_ar: ["التصميم", "البرمجة", "قصة العرض"],
  },
  {
    slug: "onehub", title_ar: "oneHub", category: "code",
    subtitle_ar: "صفحات هبوط للتجار بالاشتراك",
    summary_ar: "خدمة اشتراك تمنح التاجر صفحة هبوط جاهزة.",
  },
  {
    slug: "تطبيق-الأذان", title_ar: "تطبيق الأذان", category: "code",
    subtitle_ar: "تطبيق للآيفون والأندرويد",
    summary_ar: "تطبيق مبني بـ React Native وExpo.",
    roles_ar: ["البرمجة"],
  },
  {
    slug: "عام-بألف-ذكرى", title_ar: "عامٌ بألف ذكرى", category: "graphic",
    subtitle_ar: "التقرير السنوي لنادي أدِيب",
    summary_ar: "كتيّب التقرير السنوي، بنسخة رقمية تُقلّب صفحاتها.",
    roles_ar: ["التصميم"],
  },
  {
    slug: "كوكب-زمردة", title_ar: "كوكب زمردة", category: "graphic",
    subtitle_ar: "تطبيق للخدمات النسائية",
    summary_ar: "مساحة تجمع مقدمات الخدمات النسائية بالمستفيدات.",
  },
  {
    slug: "متنفس", title_ar: "مجتمع متنفّس", category: "graphic",
    subtitle_ar: "نادي أدِيب × أكاديمية أكسجين",
    summary_ar: "مجتمع إبداعي مفتوح لكل التخصصات، بهوية بصرية وخطة برامج لستة أشهر.",
    roles_ar: ["الهوية البصرية", "التخطيط"],
  },
];

const rows = WORKS.map((w, i) => ({
  challenge_ar: null,
  idea_ar: null,
  execution_ar: null,
  roles_ar: [],
  project_url: null,
  is_featured: false,
  ...w,
  is_published: true,
  sort_order: i + 1,
}));

const admin = createClient(url, key, { auth: { persistSession: false } });
const { error } = await admin.from("projects").upsert(rows, { onConflict: "slug" });
if (error) {
  console.error("✗", error.message);
  process.exit(1);
}
const { data } = await admin
  .from("projects")
  .select("slug,is_published,is_featured,sort_order")
  .order("sort_order");
console.log(`✅ ${rows.length} عملًا. في القاعدة الآن:`);
for (const r of data ?? [])
  console.log(` ${r.sort_order}. ${r.slug}${r.is_featured ? " ★" : ""}${r.is_published ? "" : " (غير منشور)"}`);
