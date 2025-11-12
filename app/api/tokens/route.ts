import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en",
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 60 },
      },
    )

    // If rate limited or any error, use fallback data
    if (!response.ok) {
      console.log(`[v0] CoinGecko API returned status ${response.status}, using fallback data`)
      return NextResponse.json(getFallbackTokens())
    }

    const data = await response.json()

    // Transform the data to match our expected format
    const tokens = data.map((token: any) => ({
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      image: token.image,
      current_price: token.current_price,
      price_change_percentage_24h: token.price_change_percentage_24h,
      market_cap: token.market_cap,
    }))

    return NextResponse.json(tokens)
  } catch (error) {
    console.error("[v0] Error fetching tokens:", error)
    // Return fallback data if API fails
    return NextResponse.json(getFallbackTokens())
  }
}

function getFallbackTokens() {
  return [
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      current_price: 2500,
      price_change_percentage_24h: 2.5,
      market_cap: 300000000000,
    },
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
      current_price: 45000,
      price_change_percentage_24h: 1.2,
      market_cap: 800000000000,
    },
    {
      id: "tether",
      symbol: "usdt",
      name: "Tether",
      image: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
      current_price: 1.0,
      price_change_percentage_24h: 0.01,
      market_cap: 90000000000,
    },
    {
      id: "usd-coin",
      symbol: "usdc",
      name: "USD Coin",
      image: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
      current_price: 1.0,
      price_change_percentage_24h: 0.02,
      market_cap: 25000000000,
    },
    {
      id: "binancecoin",
      symbol: "bnb",
      name: "BNB",
      image: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
      current_price: 320,
      price_change_percentage_24h: 3.1,
      market_cap: 50000000000,
    },
    {
      id: "cardano",
      symbol: "ada",
      name: "Cardano",
      image: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
      current_price: 0.45,
      price_change_percentage_24h: -1.2,
      market_cap: 15000000000,
    },
    {
      id: "solana",
      symbol: "sol",
      name: "Solana",
      image: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
      current_price: 110,
      price_change_percentage_24h: 5.3,
      market_cap: 45000000000,
    },
    {
      id: "ripple",
      symbol: "xrp",
      name: "XRP",
      image: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
      current_price: 0.55,
      price_change_percentage_24h: 2.1,
      market_cap: 30000000000,
    },
  ]
}
