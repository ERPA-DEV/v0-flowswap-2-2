// Minimal ABI for ERC-20 token balance checking
export const ERC20_ABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  // decimals
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  // symbol
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
]

// Token addresses for mainnet
export const TOKEN_ADDRESSES = {
  // Mainnet addresses
  ethereum: "0x0000000000000000000000000000000000000000", // ETH doesn't have a contract address
  bitcoin: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC on Ethereum
  tether: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT on Ethereum
  binancecoin: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52", // BNB on Ethereum
  solana: "0xD31a59c85aE9D8edEFeC411D448f90841571b89c", // SOL on Ethereum
  cardano: "0xc14777C94229582E5758C5a79b83DDE876b9BE98", // ADA on Ethereum
  ripple: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE", // XRP on Ethereum
  polkadot: "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402", // DOT on Ethereum
}

// Get native ETH balance
export async function getEthBalance(address: string): Promise<string> {
  if (!window.ethereum) {
    throw new Error("No Ethereum provider found")
  }

  try {
    // Request the balance from the provider
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    })

    // Convert from wei to ether (1 ether = 10^18 wei)
    const etherValue = Number.parseInt(balance, 16) / 1e18
    return etherValue.toFixed(4)
  } catch (error) {
    console.error("Error fetching ETH balance:", error)
    return "0.00"
  }
}

// Get ERC-20 token balance
export async function getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
  if (!window.ethereum) {
    throw new Error("No Ethereum provider found")
  }

  try {
    // Call the balanceOf function on the token contract
    const data =
      "0x70a08231" + // balanceOf function signature
      "000000000000000000000000" + // padding
      walletAddress.slice(2) // remove 0x prefix

    const result = await window.ethereum.request({
      method: "eth_call",
      params: [
        {
          to: tokenAddress,
          data,
        },
        "latest",
      ],
    })

    // Get decimals
    const decimalsData = "0x313ce567" // decimals function signature
    const decimalsResult = await window.ethereum.request({
      method: "eth_call",
      params: [
        {
          to: tokenAddress,
          data: decimalsData,
        },
        "latest",
      ],
    })

    // Parse results
    const balance = Number.parseInt(result, 16)
    const decimals = Number.parseInt(decimalsResult, 16)

    // Convert to token units
    const tokenValue = balance / Math.pow(10, decimals)

    // Format based on value
    if (tokenValue < 0.01) return tokenValue.toFixed(8)
    if (tokenValue < 1) return tokenValue.toFixed(4)
    if (tokenValue < 10000) return tokenValue.toFixed(2)
    return tokenValue.toLocaleString("en-US", { maximumFractionDigits: 2 })
  } catch (error) {
    console.error(`Error fetching token balance for ${tokenAddress}:`, error)
    return "0.00"
  }
}

// Get all relevant token balances
export async function getAllBalances(walletAddress: string, tokens: any[]): Promise<Record<string, string>> {
  const balances: Record<string, string> = {}

  try {
    // Get ETH balance
    balances.main = await getEthBalance(walletAddress)

    // Get token balances
    for (const token of tokens) {
      const tokenId = token.id.toLowerCase()
      if (TOKEN_ADDRESSES[tokenId] && TOKEN_ADDRESSES[tokenId] !== "0x0000000000000000000000000000000000000000") {
        balances[token.symbol.toLowerCase()] = await getTokenBalance(TOKEN_ADDRESSES[tokenId], walletAddress)
      }
    }

    return balances
  } catch (error) {
    console.error("Error fetching all balances:", error)
    return { main: "0.00" }
  }
}

// Check if the current network is supported
export async function checkNetwork(): Promise<boolean> {
  if (!window.ethereum) return false

  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" })
    // Ethereum mainnet is 0x1
    return chainId === "0x1"
  } catch (error) {
    console.error("Error checking network:", error)
    return false
  }
}

// Request network change to Ethereum mainnet
export async function switchToMainnet(): Promise<boolean> {
  if (!window.ethereum) return false

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }], // Ethereum mainnet
    })
    return true
  } catch (error) {
    console.error("Error switching network:", error)
    return false
  }
}
