import type { Metadata } from "next";
import 'antd/dist/reset.css';
import { ConfigProvider, Layout } from "antd";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photo Upload",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider>
          {children}
        </ConfigProvider>

      </body>
    </html>
  );
}
