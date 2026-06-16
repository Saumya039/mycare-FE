import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { AppLayout } from "@/components/AppLayout"
import { ThemeProvider } from "@/components/ThemeProvider"

const inter = Inter({
 variable: "--font-inter",
 subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
 variable: "--font-jetbrains-mono",
 subsets: ["latin"],
})

export const metadata: Metadata = {
 title: "SEVRA Management System",
 description: "Next-generation intelligent hospital management system",
}

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode
}>) {
 return (
 <html lang="en" suppressHydrationWarning>
 <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-slate-50 text-slate-900 transition-colors duration-500`}>
 <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
 <Providers>
 <AppLayout>{children}</AppLayout>
 </Providers>
 </ThemeProvider>
 </body>
 </html>
 )
}
