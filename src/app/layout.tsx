import type { Metadata } from "next";
import { Geist_Mono, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-header",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ĐẤT VÕ TRỜI VĂN",
  description: "Hỗ trợ đặt vé xem cuộc thi ĐẤT VÕ TRỜI VĂN",
  icons: "/icons/logo.ico",
  openGraph: {
    title: "ĐẤT VÕ TRỜI VĂN",
    description: "Hỗ trợ đặt vé xem cuộc thi ĐẤT VÕ TRỜI VĂN",
    images: ["/images/logo-cuocthi.jpg"],
    siteName: "Đất Võ Trời Văn",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ĐẤT VÕ TRỜI VĂN",
    description: "Hỗ trợ đặt vé xem cuộc thi ĐẤT VÕ TRỜI VĂN",
    images: ["/images/twitter-image.jpg"],
  },
  robots: "index, follow",
  keywords: [
    "đất võ trời văn",
    "cuộc thi",
    "đặt vé",
    "sự kiện",
    "văn học",
    "thi đấu",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
