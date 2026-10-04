import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

// خطّا الموقع: مانديسا للعناوين، وIBM Plex Sans Arabic للمتن
const mandisaa = localFont({
  src: "./fonts/mandisaa.ttf",
  variable: "--font-mandisaa",
  display: "swap",
});

// خط المتن — وضوح عالٍ في الأحجام الصغيرة
const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

// يُنظَّف من المسافات والأحرف الخفية (مثل BOM) — رابط غير صالح يكسر البناء
function siteUrl(): URL {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/[\uFEFF\u200B-\u200F\s]/g, "");
  try {
    return new URL(raw || "https://m7-almattar.vercel.app");
  } catch {
    return new URL("https://m7-almattar.vercel.app");
  }
}

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: "محمد المطر — مصمم جرافيك",
    template: "%s · محمد المطر",
  },
  description:
    "محمد المطر من الأحساء: تصميم جرافيك، ومونتاج، وموشن جرافيك، وبرمجة، وتعليق صوتي.",
  keywords: [
    "محمد المطر",
    "معرض أعمال",
    "تصميم جرافيك",
    "مونتاج",
    "موشن جرافيك",
    "برمجة",
    "تعليق صوتي",
    "الأحساء",
  ],
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "محمد المطر — مصمم جرافيك" }],
    title: "محمد المطر — مصمم جرافيك",
    description:
      "تصميم جرافيك، ومونتاج، وموشن جرافيك، وبرمجة، وتعليق صوتي.",
  },
};

export const viewport: Viewport = {
  themeColor: "#070e18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${mandisaa.variable} ${plex.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
