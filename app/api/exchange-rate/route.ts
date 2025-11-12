import { NextResponse } from "next/server"
import axios from "axios"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// In-memory cache with expiration
const cache = new Map()
const CACHE_DURATION = 60 * 1000 // 60 seconds in milliseconds

// Track API failures to implement backoff
let consecutiveFailures = 0
let lastFailureTime = 0
let backoffEndTime = 0

// Fallback rates for when API fails completely
const fallbackRates = {
  bitcoin: { usd: 65000 },
  ethereum: { usd: 3500 },
  tether: { usd: 1 },
  binancecoin: { usd: 600 },
  solana: { usd: 150 },
  ripple: { usd: 0.6 },
  cardano: { usd: 0.5 },
  polkadot: { usd: 7 },
  dogecoin: { usd: 0.1 },
  // Alternative symbols
  btc: { usd: 65000 },
  eth: { usd: 3500 },
  bnb: { usd: 600 },
  sol: { usd: 150 },
  xrp: { usd: 0.6 },
  ada: { usd: 0.5 },
  dot: { usd: 7 },
  doge: { usd: 0.1 },
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const fromToken = searchParams.get("from")?.toLowerCase() || "tether"
    const toToken = searchParams.get("to")?.toLowerCase() || "bitcoin"

    // Create a list of tokens to fetch
    const tokens = new Set([fromToken, toToken])
    const tokenList = Array.from(tokens)
    const tokenListString = tokenList.join(",")

    // Check if we have a valid cached response
    const cacheKey = tokenListString
    const cachedData = cache.get(cacheKey)

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log("Returning cached exchange rates")
      return NextResponse.json(cachedData.data)
    }

    // Check if we're still in backoff period
    const now = Date.now()
    if (now < backoffEndTime) {
      console.log(
        `Still in backoff period for ${Math.ceil((backoffEndTime - now) / 1000)}s. Using fallback or cached data.`,
      )

      // If we have cached data, even if expired, use it as a fallback
      if (cachedData) {
        return NextResponse.json(cachedData.data)
      }

      // Otherwise use hardcoded fallback rates
      const fallbackResponse = getFallbackResponse(tokenList)
      return NextResponse.json(fallbackResponse.data)
    }

    // Attempt to fetch from CoinGecko API
    try {
      // Add a small delay to avoid hitting rate limits in quick succession
      await new Promise((resolve) => setTimeout(resolve, 100))

      console.log(`Attempting to fetch exchange rates from CoinGecko for ${tokenListString}`)

      // Use axios instead of fetch for better error handling
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: tokenListString,
          vs_currencies: "usd",
        },
        headers: {
          Accept: "application/json",
          "User-Agent": "NeonSwap/1.0.0 (https://neonswap.vercel.app)",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        timeout: 10000, // Increased from 5000 to 10000ms (10 seconds)
      })

      // Reset consecutive failures on success
      consecutiveFailures = 0
      backoffEndTime = 0

      // Cache the result
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      })

      return NextResponse.json(response.data)
    } catch (error) {
      console.error("Error fetching exchange rates from CoinGecko:", error.message)

      // Specifically handle timeout errors
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        console.log("Request timed out, using fallback data")

        // If we have cached data, even if expired, use it as a fallback
        if (cachedData) {
          console.log("Using expired cache as fallback after timeout")
          return NextResponse.json(cachedData.data)
        }

        // Otherwise use hardcoded fallback rates
        const fallbackResponse = getFallbackResponse(tokenList)
        return NextResponse.json(fallbackResponse.data)
      }

      // Handle rate limiting specifically
      if (error.response && error.response.status === 429) {
        // Increment failure counter
        consecutiveFailures++
        lastFailureTime = now

        // Calculate backoff time (exponential with jitter)
        // Use a longer backoff for rate limiting
        const backoffSeconds = Math.min(300, Math.pow(2, consecutiveFailures + 2) + Math.random() * 10)
        backoffEndTime = now + backoffSeconds * 1000
        console.log(`Rate limited by CoinGecko API (429). Backing off for ${backoffSeconds.toFixed(1)}s`)

        // If we have cached data, even if expired, use it as a fallback
        if (cachedData) {
          console.log("Using expired cache as fallback after rate limit")
          return NextResponse.json(cachedData.data)
        }

        // Otherwise use hardcoded fallback rates
        const fallbackResponse = getFallbackResponse(tokenList)
        return NextResponse.json(fallbackResponse.data)
      }

      // For other errors
      consecutiveFailures++

      // If we have cached data, even if expired, use it as a fallback
      if (cachedData) {
        console.log("Using expired cache as fallback")
        return NextResponse.json(cachedData.data)
      }

      // If we have no cached data, use hardcoded fallback rates
      const fallbackResponse = getFallbackResponse(tokenList)
      return NextResponse.json(fallbackResponse.data)
    }
  } catch (error) {
    console.error("Unexpected error in exchange rate API:", error.message)

    // Always return a valid response, even in case of errors
    const fallbackResponse = getFallbackResponse(["bitcoin", "ethereum", "tether", "solana"])
    return NextResponse.json(fallbackResponse.data)
  }
}

// Helper function to get fallback response
function getFallbackResponse(tokenList) {
  const result = {}

  tokenList.forEach((token) => {
    result[token] = fallbackRates[token] || { usd: 1 }
  })

  return {
    data: result,
    timestamp: Date.now(),
  }
}
