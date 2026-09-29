import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import {
  Aref_Ruqaa,
  IBM_Plex_Sans_Arabic,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

// خط العناوين — مانديسا
const mandisaa = localFont({
  src: "./fonts/mandisaa.ttf",
  variable: "--font-mandisaa",
  display: "swap",
});

// خط اليد — للملاحظات والهوامش (رقعة)
const ruqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-ruqaa",
  display: "swap",
});

// خط المتن — وضوح عالٍ في الأحجام الصغيرة
const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

// اللاتيني التقني
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-grotesk",
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
    "محمد المطر: آخذ الفكرة من أول شرارة، وأحلّق بها حتى تنضج، ثم أنفّذها بنفسي: تصميم، وبرمجة، وحركة، وصوت.",
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
      "آخذ الفكرة من أول شرارة، وأحلّق بها حتى تنضج، ثم أنفّذها بنفسي.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1c30",
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
      className={`${mandisaa.variable} ${ruqaa.variable} ${plex.variable} ${grotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
