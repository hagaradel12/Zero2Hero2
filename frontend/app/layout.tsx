import type React from "react"
import "@/app/globals.css"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"


const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata = {
  title: "Zero2Hero - AI Programming Tutor",
  description: "Master problem decomposition with AI-powered guidance",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground font-sans">
        {children}
        <Toaster /> {/* ✅ Enables the toast messages */}
      </body>
    </html>
  )
}