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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://m7-almattar.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "محمد المطر — أعيش الفكرة",
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
  openGraph: {
    type: "website",
    locale: "ar_SA",
    title: "محمد المطر — أعيش الفكرة",
    description:
      "تصميم جرافيك، ومونتاج، وموشن جرافيك، وبرمجة، وتعليق صوتي.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
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
