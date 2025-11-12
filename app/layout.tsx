import type React from "react"
import "./globals.css"

// Update the metadata export to include comprehensive website information
export const metadata = {
  title: "FlowBit | AI-Powered Token Swap Platform",
  description:
    "FlowBit is a revolutionary platform for instant AI token swaps with enhanced privacy and security. Swap over 600 tokens without wallet connection.",
  keywords: "crypto, token swap, cryptocurrency exchange, AI swap, blockchain, flowbit, ghost swap",
  authors: [{ name: "FlowBit Team" }],
  creator: "FlowBit",
  publisher: "FlowBit",
  openGraph: {
    title: "FlowBit | AI-Powered Token Swap Platform",
    description:
      "Instant AI token swaps with enhanced privacy and security. Swap over 600 tokens without wallet connection.",
    url: "https://flowbit.vercel.app",
    siteName: "FlowBit",
  },
  icons: {
    icon: "/favicon.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
