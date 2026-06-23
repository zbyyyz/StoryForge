import type { Metadata } from "next";
import "./globals.css";
import { AppInit } from "./app-init";

export const metadata: Metadata = {
  title: "StoryForge - 创意到作品的转化器",
  description: "让有故事的人，不被笔力限制",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <AppInit />
        {children}
      </body>
    </html>
  );
}
