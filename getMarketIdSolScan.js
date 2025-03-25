const axios = require("axios");

const SOLSCAN_API_BASE = "https://api.solscan.io";
const tokenMint = "ATsBMXc7axwYonYrdkHqKEAUWadoM4ygJ9dptpsqpump"; // Pump fun token
const SOLSCAN_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3MzcwNDE3NTQ4MTksImVtYWlsIjoiem9yYW4ubGF6aWMud29ya0BnbWFpbC5jb20iLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3MzcwNDE3NTR9.8Ef6HOZsKD-RULUffsrDVPWfe4LILjAfbKyHx2T2dDo"; // Replace with your API key

async function fetchSolscanMarketData(mintAddress) {
  const url = `${SOLSCAN_API_BASE}/token/meta`;

  try {
    const response = await axios.get(url, {
      headers: { token: SOLSCAN_API_KEY },
      params: { tokenAddress: mintAddress },
    });

    const data = response.data;
    if (data?.success && data?.data?.markets?.length > 0) {
      return data.data.markets; // Return market data
    } else {
      console.error("No market data found for token.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching Solscan market data:", error);
    return [];
  }
}

async function getMarketId() {
  try {
    console.log(`Fetching market data for token mint: ${tokenMint}...`);
    const markets = await fetchSolscanMarketData(tokenMint);

    if (markets.length === 0) {
      console.log("No market information found for this token.");
      return;
    }

    // Assuming the first market in the response is relevant
    const selectedMarket = markets[0];
    console.log("Market info:", selectedMarket);

    const marketId = selectedMarket.marketId || selectedMarket.marketName;
    console.log("Market ID:", marketId);

    // You can now fetch additional pool information using marketId if needed
    console.log("Market ID fetched successfully:", marketId);
  } catch (error) {
    console.error("Error getting market ID:", error);
  }
}

getMarketId();
