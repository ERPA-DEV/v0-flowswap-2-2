"use client"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import { cn } from "@/lib/utils"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
  hideOnMobile = false,
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
  hideOnMobile?: boolean
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", hideOnMobile ? "hidden md:block" : "", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  )
}

export default function HeroGeometric() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main shape - keep on both mobile and desktop */}
      <ElegantShape
        delay={0.3}
        width={600}
        height={140}
        rotate={12}
        gradient="from-blue-500/[0.12]"
        className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
      />

      {/* Keep this shape on both mobile and desktop but make it smaller on mobile */}
      <ElegantShape
        delay={0.5}
        width={500}
        height={120}
        rotate={-15}
        gradient="from-indigo-500/[0.12]"
        className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%] scale-75 md:scale-100"
      />

      {/* Hide these shapes on mobile */}
      <ElegantShape
        delay={0.4}
        width={300}
        height={80}
        rotate={-8}
        gradient="from-blue-400/[0.12]"
        hideOnMobile={true}
        className="left-[5%] md:left-[10%] bottom-[15%] md:bottom-[20%]"
      />

      <ElegantShape
        delay={0.6}
        width={250}
        height={60}
        rotate={20}
        gradient="from-blue-600/[0.12]"
        hideOnMobile={true}
        className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
      />

      <ElegantShape
        delay={0.7}
        width={180}
        height={40}
        rotate={-25}
        gradient="from-indigo-400/[0.12]"
        hideOnMobile={true}
        className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
      />
    </div>
  )
}
