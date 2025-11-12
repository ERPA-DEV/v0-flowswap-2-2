"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, User, Globe } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4">
      <div className="container mx-auto px-4">
        
      </div>
    </div>
  )
}
