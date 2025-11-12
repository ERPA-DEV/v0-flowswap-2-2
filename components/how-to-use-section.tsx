"use client"

import { Wallet, ArrowRight, Search, Zap, Shield, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function HowToUseSection() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Select Your Tokens",
      description:
        "Choose the token you want to swap from and the token you want to receive. We support over 600 different cryptocurrencies.",
      color: "from-blue-500/20 to-blue-600/20",
      iconBg: "from-blue-500 to-blue-600",
    },
    {
      number: "02",
      icon: Wallet,
      title: "Enter Amount & Address",
      description:
        "Input the amount you wish to swap and provide the recipient wallet address where you want to receive your tokens.",
      color: "from-blue-600/20 to-indigo-600/20",
      iconBg: "from-blue-600 to-indigo-600",
    },
    {
      number: "03",
      icon: Shield,
      title: "Review & Confirm",
      description:
        "Double-check your transaction details including exchange rate, fees, and recipient address before confirming the swap.",
      color: "from-indigo-500/20 to-indigo-600/20",
      iconBg: "from-indigo-500 to-indigo-600",
    },
    {
      number: "04",
      icon: Zap,
      title: "Complete Transaction",
      description:
        "Send your tokens to the provided address. Your swap will be processed instantly and securely without any wallet connection.",
      color: "from-indigo-400/20 to-blue-500/20",
      iconBg: "from-indigo-400 to-blue-500",
    },
  ]

  const features = [
    { icon: CheckCircle, text: "No wallet connection required" },
    { icon: CheckCircle, text: "Lightning-fast processing" },
    { icon: CheckCircle, text: "Competitive exchange rates" },
    { icon: CheckCircle, text: "24/7 customer support" },
  ]

  return (
    <div className="w-full bg-[#0a0b14] py-20 relative z-10 border-t border-gray-800/20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-0 overflow-hidden">
        {/* Section Header */}
        <div className="text-left mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6"
          >
            <Zap className="w-4 h-4 mr-2" />
            How It Works
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Start Swapping in{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
              Four Simple Steps
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl leading-relaxed"
          >
            FlowBit makes cryptocurrency swapping effortless. Follow these simple steps to exchange your tokens securely
            and instantly.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 max-w-[calc(72rem*0.98)]">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Card */}
              <div className="bg-[#0c0c14] rounded-2xl border border-[#1e2033] p-6 h-full hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:bg-[#0d0d16]">
                {/* Step Number */}
                <div className="text-6xl font-bold bg-gradient-to-br from-blue-500/20 to-indigo-500/20 bg-clip-text text-transparent mb-4">
                  {step.number}
                </div>

                {/* Icon with Gradient Background */}
                <div className="relative mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.iconBg} flex items-center justify-center shadow-lg`}
                    style={{
                      boxShadow: "0 8px 24px rgba(59, 130, 246, 0.25)",
                    }}
                  >
                    <step.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3 leading-tight">{step.title}</h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>

                {/* Arrow indicator for non-last items */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                    <ArrowRight className="w-6 h-6 text-blue-500/40" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-blue-500/5 rounded-2xl border border-blue-500/20 p-6 md:p-8 lg:p-10 max-w-[calc(72rem*0.98)] relative overflow-hidden"
          style={{
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.1)",
          }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 relative z-10">
            {/* Left Content */}
            <div className="flex-1 w-full">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                Why Choose FlowBit for Your Swaps?
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Experience the future of decentralized trading with our secure, fast, and user-friendly platform.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                      <feature.icon className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
                    </div>
                    <span className="text-white text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right CTA */}
            <div className="flex-shrink-0 w-full md:w-auto">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="w-full md:w-auto group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 md:px-8 py-4 rounded-xl transition-all duration-300 font-semibold text-base md:text-lg flex items-center justify-center overflow-hidden"
                style={{
                  boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                }}
              >
                {/* Shimmer effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                <span className="relative z-10 flex items-center">
                  Start Swapping Now
                  <ArrowRight
                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                    strokeWidth={2.5}
                  />
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
