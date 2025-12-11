import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { URLS } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: "Virtusかんたんクレジット決済の確認について",
  description: "Virtusかんたんクレジット決済",
  icons: {
    icon: URLS.ICON,
    apple: URLS.ICON,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
