import type { Metadata } from "next";
import {
  Aref_Ruqaa,
  Tajawal,
  IBM_Plex_Sans_Arabic,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

// عناوين كبرى — رقعة عربية حرّة تناغم انسيابية الشعار
const aref = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-aref",
  display: "swap",
});

// عناوين فرعية — هندسي دافئ واضح
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

// المتن والأوصاف ولوحة التحكم — وضوح عالٍ في الأحجام الصغيرة
const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

// اللاتيني المرافق — أرقام وروابط ومصطلحات تقنية
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "محمد بن إسماعيل — مُبدِعٌ واحد، خمسُ حِرَف",
    template: "%s · محمد بن إسماعيل",
  },
  description:
    "بورتفوليو محمد بن إسماعيل: تصميم جرافيك، مونتاج، موشن جرافيك، برمجة، وتعليق صوتي. حِسٌّ إبداعي واحد يتجلّى في خمس حِرَف.",
  keywords: [
    "بورتفوليو",
    "تصميم جرافيك",
    "مونتاج",
    "موشن جرافيك",
    "برمجة",
    "تعليق صوتي",
  ],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    title: "محمد بن إسماعيل — مُبدِعٌ واحد، خمسُ حِرَف",
    description:
      "حِسٌّ إبداعي واحد يتجلّى في خمس حِرَف: جرافيك، مونتاج، موشن، برمجة، وتعليق صوتي.",
  },
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
      className={`${aref.variable} ${tajawal.variable} ${plex.variable} ${grotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
