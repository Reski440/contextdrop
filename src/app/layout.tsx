import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ContextDrop — Your Project's External Memory",
    template: "%s | ContextDrop",
  },
  description:
    "Keep track of your projects, coding sessions, tasks, and technical decisions. Pick up where you left off.",
  applicationName: "ContextDrop",
  keywords: [
    "developer tools",
    "project management",
    "coding workspace",
    "developer productivity",
    "session tracking",
  ],
  authors: [{ name: "ContextDrop" }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
