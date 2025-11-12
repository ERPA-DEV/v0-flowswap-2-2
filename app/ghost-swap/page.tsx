"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronDown, ArrowDown, CheckCircle, XCircle, AlertCircle, Loader2, Shield, Lock } from "lucide-react"
import Sidebar from "@/components/sidebar"
import TokenSelector from "@/components/token-selector"
import TransactionModal from "@/components/transaction-modal"

export default function GhostSwap() {
  const [fromToken, setFromToken] = useState({
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  })
  const [toToken, setToToken] = useState({
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  })
  const [showFromTokenSelector, setShowFromTokenSelector] = useState(false)
  const [showToTokenSelector, setShowToTokenSelector] = useState(false)
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState(0)
  const [fromRate, setFromRate] = useState(0)
  const [toRate, setToRate] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [recipientAddress, setRecipientAddress] = useState("")
  const [isValidatingAddress, setIsValidatingAddress] = useState(false)
  const [addressValidation, setAddressValidation] = useState(null)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [fetchError, setFetchError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Calculate exchange rate whenever rates change
  useEffect(() => {
    if (fromRate > 0 && toRate > 0 && fromAmount) {
      calculateExchange(fromAmount, "from")
    }
  }, [fromRate, toRate, fromAmount])

  // Fetch exchange rates
  const fetchRates = useCallback(async () => {
    if (fromToken.id === toToken.id) {
      return
    }

    setIsLoading(true)

    try {
      // Add cache-busting parameter to avoid cached responses
      const timestamp = Date.now()
      const res = await fetch(`/api/exchange-rate?from=${fromToken.id}&to=${toToken.id}&_=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`)
      }

      const data = await res.json()

      // Update rates
      if (data[fromToken.id]?.usd) {
        setFromRate(data[fromToken.id].usd)
      }

      if (data[toToken.id]?.usd) {
        setToRate(data[toToken.id].usd)
      }

      // Update last updated timestamp
      setLastUpdated(new Date())
      setFetchError(false)
      setErrorMessage("")
    } catch (error) {
      console.error("Error fetching rates:", error)
      setFetchError(true)
      setErrorMessage(error.message || "Failed to fetch exchange rates")
    } finally {
      setIsLoading(false)
    }
  }, [fromToken.id, toToken.id])

  // Fetch rates on component mount and when tokens change
  useEffect(() => {
    fetchRates()

    // Set up interval to fetch rates every 30 seconds
    const interval = setInterval(fetchRates, 30000)

    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [fetchRates])

  const calculateExchange = (value, direction) => {
    if (!fromRate || !toRate) return

    const numValue = Number.parseFloat(value) || 0

    if (direction === "from") {
      // Calculate how much toToken you get for the fromAmount
      const fromValueInUsd = numValue * fromRate
      const toTokenAmount = fromValueInUsd / toRate
      setToAmount(toTokenAmount)
    } else {
      // Calculate how much fromToken you need to spend to get toAmount
      const toValueInUsd = numValue * toRate
      const fromTokenAmount = toValueInUsd / fromRate
      setFromAmount(fromTokenAmount.toString())
    }
  }

  const handleFromAmountChange = (e) => {
    const value = e.target.value
    setFromAmount(value)
    calculateExchange(value, "from")
  }

  const handleToAmountChange = (e) => {
    const value = e.target.value
    setToAmount(Number.parseFloat(value) || 0)
    calculateExchange(value, "to")
  }

  const handleSelectFromToken = (token) => {
    if (token.id === toToken.id) {
      setToToken(fromToken)
    }
    setFromToken(token)
    setShowFromTokenSelector(false)
    fetchRates()
  }

  const handleSelectToToken = (token) => {
    if (token.id === fromToken.id) {
      setFromToken(toToken)
    }
    setToToken(token)
    setShowToTokenSelector(false)
    fetchRates()
  }

  const swapTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)

    const tempAmount = fromAmount
    setFromAmount(toAmount.toString())
    setToAmount(Number.parseFloat(tempAmount) || 0)

    fetchRates()
  }

  // Validate wallet address
  const validateWalletAddress = () => {
    if (!recipientAddress) {
      setAddressValidation({
        isValid: false,
        message: "Please enter a wallet address",
      })
      return
    }

    setIsValidatingAddress(true)
    setAddressValidation(null)

    // Simulate API call for validation
    setTimeout(() => {
      let isValid = false
      let message = ""

      // Validate based on token type
      if (toToken.symbol.toLowerCase() === "btc") {
        // Bitcoin address validation
        if (!/^(1|3|bc1)[a-zA-Z0-9]{25,42}$/.test(recipientAddress)) {
          isValid = false
          message = "Invalid Bitcoin address format"
        } else {
          isValid = true
          message = "Valid Bitcoin address"
        }
      } else if (toToken.symbol.toLowerCase() === "sol") {
        // Solana address validation
        if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(recipientAddress)) {
          isValid = false
          message = "Invalid Solana address format"
        } else {
          isValid = true
          message = "Valid Solana address"
        }
      } else {
        // Ethereum address validation
        if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
          isValid = false
          message = "Invalid Ethereum address format"
        } else {
          isValid = true
          message = "Valid Ethereum address"
        }
      }

      setAddressValidation({ isValid, message })
      setIsValidatingAddress(false)

      // If address is valid, show the transaction modal
      if (isValid) {
        setTimeout(() => {
          setShowTransactionModal(true)
        }, 500)
      }
    }, 1500) // Simulate network delay
  }

  return (
    <div className="flex min-h-screen bg-[#0a0b14] overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute top-[20%] left-[15%] w-[300px] h-[300px] rounded-full bg-[#3b52b4]/10 blur-[120px] animate-pulse-slow"></div>
        <div
          className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-[#7b52ff]/5 blur-[150px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-[60%] right-[30%] w-[200px] h-[200px] rounded-full bg-[#52a5ff]/10 blur-[100px] animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10">
        {/* Left Content Area */}
        <div className="w-full md:w-[45%] lg:w-[40%] p-6 md:p-8 lg:p-10">
          {/* Privacy badge */}
          <div className="mb-3">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1a1a2e]/60 text-purple-400 text-xs">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-1.5"></span>
              GHOST SWAP
            </div>
          </div>

          <div className="max-w-lg">
            <h1 className="text-4xl font-bold mb-6 text-white leading-tight">
              Private Token
              <br />
              Swaps with No
              <br />
              Trace
            </h1>

            <p className="text-gray-400 mb-4 text-sm">
              Ghost-Swap provides enhanced privacy for your cryptocurrency transactions through multiple
              privacy-enhancing layers, ensuring your swaps remain confidential and secure.
            </p>

            <p className="text-gray-400 mb-4 text-sm">
              Experience true financial privacy with our cutting-edge technology that routes transactions through
              advanced privacy protocols, keeping your trading activity completely private.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium text-sm mb-1">No KYC Required</h3>
                  <p className="text-gray-500 text-xs">Swap tokens without identity verification</p>
                </div>
              </div>
              <div className="flex items-start">
                <Lock className="h-5 w-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium text-sm mb-1">Enhanced Privacy Layers</h3>
                  <p className="text-gray-500 text-xs">Multiple privacy-enhancing routing protocols</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium text-sm mb-1">No Wallet Connection</h3>
                  <p className="text-gray-500 text-xs">Receive tokens directly to your address</p>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-xs italic mb-6">
              Note: While Ghost-Swap enhances privacy, it is not completely anonymous. Always follow your local
              regulations regarding cryptocurrency transactions.
            </p>
          </div>
        </div>

        {/* Right Panel with Ghost Swap Calculator */}
        <div className="w-full md:w-[50%] lg:w-[55%] p-6 flex items-center justify-center overflow-hidden">
          <div className="w-full max-w-md bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800/20">
            {/* Calculator Header */}
            <div className="p-6 pb-0">
              <h2 className="text-2xl font-medium text-white mb-6">Ghost Swap</h2>

              {/* Pay Section */}
              <div className="mb-4">
                <p className="text-gray-400 mb-3">You Send</p>
                <div className="bg-[#111] rounded-xl p-4 border border-gray-800/30 flex items-center justify-between">
                  <button onClick={() => setShowFromTokenSelector(true)} className="flex items-center space-x-2">
                    <img src={fromToken.image || "/placeholder.svg"} alt={fromToken.name} className="w-7 h-7" />
                    <span className="font-medium text-white text-lg ml-2">{fromToken.symbol.toUpperCase()}</span>
                    <ChevronDown className="h-5 w-5 text-gray-400 ml-1" />
                  </button>
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={handleFromAmountChange}
                    placeholder="0.00"
                    className="bg-transparent text-right text-2xl font-normal text-white w-1/2 focus:outline-none placeholder:text-gray-500 placeholder:opacity-50"
                  />
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center my-4">
                <div
                  className="bg-[#111] p-3 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={swapTokens}
                >
                  <ArrowDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Receive Section */}
              <div className="mb-6">
                <p className="text-gray-400 mb-3">You Receive</p>
                <div className="bg-[#111] rounded-xl p-4 border border-gray-800/30 flex items-center justify-between">
                  <button onClick={() => setShowToTokenSelector(true)} className="flex items-center space-x-2">
                    <img src={toToken.image || "/placeholder.svg"} alt={toToken.name} className="w-7 h-7" />
                    <span className="font-medium text-white text-lg ml-2">{toToken.symbol.toUpperCase()}</span>
                    <ChevronDown className="h-5 w-5 text-gray-400 ml-1" />
                  </button>
                  <input
                    type="text"
                    value={toAmount === 0 ? "" : toAmount.toString()}
                    onChange={handleToAmountChange}
                    placeholder="0.00"
                    className="bg-transparent text-right text-2xl font-normal text-white w-1/2 focus:outline-none placeholder:text-gray-500 placeholder:opacity-50"
                  />
                </div>
              </div>

              {/* Exchange Rate */}
              <div className="text-gray-500 text-sm mb-6 flex justify-between">
                <div>
                  1 {fromToken.symbol.toUpperCase()} ≈ {fromRate && toRate ? (fromRate / toRate).toFixed(8) : "..."}{" "}
                  {toToken.symbol.toUpperCase()}
                </div>
                <div className="flex items-center">
                  {isLoading && <Loader2 className="h-3 w-3 text-blue-400 animate-spin mr-2" />}
                  {lastUpdated && (
                    <span>
                      Updated{" "}
                      {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                  )}
                </div>
              </div>

              {/* Error message if API fails */}
              {fetchError && (
                <div className="mb-4 px-3 py-2 bg-yellow-500/10 text-yellow-400 text-sm rounded-lg flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="flex-1">{errorMessage || "Rate update failed. Using last known rates."}</span>
                </div>
              )}

              {/* Recipient Address */}
              <div className="mb-6">
                <p className="text-gray-400 mb-3">Recipient Address</p>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Enter ${toToken.symbol} address`}
                    value={recipientAddress}
                    onChange={(e) => {
                      setRecipientAddress(e.target.value)
                      setAddressValidation(null)
                    }}
                    className={`w-full bg-[#111] border ${
                      addressValidation
                        ? addressValidation.isValid
                          ? "border-green-500/50"
                          : "border-red-500/50"
                        : "border-gray-800/30"
                    } rounded-xl px-4 py-4 text-white focus:outline-none h-[56px]`}
                  />
                  {isValidatingAddress && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                    </div>
                  )}
                  {addressValidation && !isValidatingAddress && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {addressValidation.isValid ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Address Validation Message */}
              {addressValidation && !isValidatingAddress && (
                <div
                  className={`mb-6 px-4 py-2 rounded-xl text-sm ${
                    addressValidation.isValid ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {addressValidation.message}
                </div>
              )}

              {/* Create Ghost-Swap button */}
              <button
                onClick={validateWalletAddress}
                disabled={isValidatingAddress || !fromAmount}
                className={`w-full ${
                  isValidatingAddress || !fromAmount
                    ? "bg-[#1e2033] cursor-not-allowed"
                    : addressValidation?.isValid
                      ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                      : "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                } text-white py-4 rounded-xl transition-colors font-medium text-lg mb-6`}
              >
                {isValidatingAddress ? (
                  <>
                    <Loader2 className="inline animate-spin mr-2 h-5 w-5" />
                    Validating Address...
                  </>
                ) : !fromAmount ? (
                  "Enter Amount"
                ) : !recipientAddress ? (
                  "Enter Recipient Address"
                ) : addressValidation?.isValid ? (
                  "Create Ghost-Swap"
                ) : (
                  "Enter Valid Address"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Token Selectors */}
      {showFromTokenSelector && (
        <TokenSelector onSelectToken={handleSelectFromToken} onClose={() => setShowFromTokenSelector(false)} />
      )}

      {showToTokenSelector && (
        <TokenSelector onSelectToken={handleSelectToToken} onClose={() => setShowToTokenSelector(false)} />
      )}

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        fromAmount={Number.parseFloat(fromAmount) || 0}
        fromToken={fromToken}
        toAmount={toAmount}
        toToken={toToken}
        recipientAddress={recipientAddress}
      />
    </div>
  )
}
