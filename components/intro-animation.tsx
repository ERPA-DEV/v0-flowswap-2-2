"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Set a timeout as a fallback in case the video doesn't trigger onEnded
    const timer = setTimeout(() => {
      handleAnimationComplete()
    }, 6000) // Animation plays for 6 seconds before transitioning

    // Create a progress bar that fills up over 6 seconds
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          return 100
        }
        return prev + 100 / (6000 / 50) // Update every 50ms to reach 100% in 6000ms
      })
    }, 50)

    return () => {
      clearTimeout(timer)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleAnimationComplete = () => {
    setIsAnimationComplete(true)
    // Add a small delay before calling onComplete to allow for exit animation
    setTimeout(() => {
      onComplete()
    }, 800)
  }

  return (
    <AnimatePresence>
      {!isAnimationComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0b14]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Enhanced background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#3b52b4]/10 to-[#3b9bd9]/10 blur-[100px] animate-pulse-slow"></div>
            <div
              className="absolute bottom-1/3 right-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-[#3b52b4]/5 to-[#3b9bd9]/10 blur-[120px] animate-pulse-slow"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-2/3 left-1/2 w-[200px] h-[200px] rounded-full bg-[#3b52b4]/10 blur-[80px] animate-pulse-slow"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>

          <motion.div
            className="relative w-full max-w-sm mx-auto px-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Enhanced video container */}
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a2e]/80 to-[#0c0c14]/80 p-[1px] shadow-[0_0_30px_rgba(59,82,180,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50"></div>
              <img
                src="/images/design-mode/Animationintropage.gif"
                alt="FlowBit Loading Animation"
                className="w-full h-auto rounded-xl relative z-10"
                onLoad={() => {
                  // Simulate the video's onEnded event after a fixed duration
                  setTimeout(handleAnimationComplete, 5000)
                }}
              />

              {/* Subtle border glow */}
              <div className="absolute inset-0 rounded-xl border border-blue-500/20 pointer-events-none"></div>
            </div>

            {/* Progress bar */}
            <motion.div
              className="mt-4 h-1 bg-[#1e2033] rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${progress}%` }}
              />
            </motion.div>

            {/* Subtle tagline */}
            <motion.p
              className="text-center text-xs text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.7 }}
            >
              The Future of Token Swapping
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
