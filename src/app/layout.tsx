import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "ClickablePhoto v2 - Modern Social Media Card Generator",
  description: "Create stunning social media cards with modern technology. Built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.",
  keywords: ["social media", "card generator", "image processing", "Next.js", "TypeScript"],
  authors: [{ name: "ClickablePhoto Team" }],
  openGraph: {
    title: "ClickablePhoto v2 - Modern Social Media Card Generator",
    description: "Create stunning social media cards with modern technology",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClickablePhoto v2",
    description: "Create stunning social media cards with modern technology",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta property="fb:app_id" content="1234567890" />
        <meta name="robots" content="index, follow" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
