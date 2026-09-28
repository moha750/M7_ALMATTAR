import type { Metadata } from "next";
import localFont from "next/font/local";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

// الخط الأساسي لكامل الموقع
const mandisaa = localFont({
  src: "./fonts/mandisaa.ttf",
  variable: "--font-mandisaa",
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
    default: "محمد المطر — مُبدِعٌ واحد، خمسُ حِرَف",
    template: "%s · محمد المطر",
  },
  description:
    "بورتفوليو محمد المطر: تصميم جرافيك، مونتاج، موشن جرافيك، برمجة، وتعليق صوتي. حِسٌّ إبداعي واحد يتجلّى في خمس حِرَف.",
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
    title: "محمد المطر — مُبدِعٌ واحد، خمسُ حِرَف",
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
      className={`${mandisaa.variable} ${grotesk.variable} h-full antialiased`}
    >
      <body className={`${mandisaa.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
