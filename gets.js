const axios = require("axios");
const retryFetchPoolKeys = require("./xx");
const tokenMint = "ATsBMXc7axwYonYrdkHqKEAUWadoM4ygJ9dptpsqpump";

function normalizeRaydiumBetaPoolInfoResponse(response) {
  if (!response || typeof response !== "object") {
    return [];
  }

  let items;

  if (Array.isArray(response)) {
    items = response;
  } else if (Array.isArray(response.data)) {
    items = response.data;
  } else {
    items = [];
  }

  return items.filter(
    (p) => p?.price && p?.mintAmountA && p?.mintAmountB && p?.mintA && p?.mintB
  );
}

async function fetchPoolInfo(tokenMint) {
  const mint1 = tokenMint;
  const mint2 = "So11111111111111111111111111111111111111112";
  const poolType = "standard";
  const poolSortField = "default";
  const sortType = "desc";
  const pageSize = 100;
  const page = 1;

  const url = `https://api-v3.raydium.io/pools/info/mint?mint1=${mint1}&mint2=${mint2}&poolType=${poolType}&poolSortField=${poolSortField}&sortType=${sortType}&pageSize=${pageSize}&page=${page}`;

  try {
    const response = await axios.get(url);
    return response.data.data.data;
  } catch (error) {
    console.error("Error fetching pool info:", error);
    return [];
  }
}

async function getMarketId() {
  const checkPoolAvailability = async () => {
    const tokenPool = normalizeRaydiumBetaPoolInfoResponse(
      await fetchPoolInfo(tokenMint)
    ).find(
      (p) => p.mintA.address === tokenMint || p.mintB.address === tokenMint
    );

    return tokenPool || null;
  };

  let tokenPool = null;
  const maxRetries = 10; // Maximum number of retries
  const delay = 5000; // 5 seconds delay between retries

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Attempt ${attempt} to fetch token pool info...`);
    tokenPool = await checkPoolAvailability();

    if (tokenPool) {
      console.log("Token pool found:", tokenPool);
      break;
    }

    console.log("Token pool not found yet. Retrying...");
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  if (!tokenPool) {
    console.error("Token pool not found after maximum retries.");
    return;
  }

  const marketId = tokenPool.marketId;

  try {
    const poolInfo = await retryFetchPoolKeys(marketId);
    console.log("Pool info:", poolInfo);
  } catch (error) {
    console.error("Error fetching pool keys:", error);
  }
}

getMarketId();
