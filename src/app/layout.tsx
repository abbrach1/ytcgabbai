import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toras Chaim Gabbai System",
  description: "Toras Chaim Yeshiva - Member Card Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
