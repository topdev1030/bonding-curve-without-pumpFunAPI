const axios = require("axios");
const { PublicKey } = require("@solana/web3.js");
const retryFetchPoolKeys = require("./xx");
const tokenMint = "G3N1LAxLihe12yQfAnNpGmkERLVFmT2arNXmu39pHsAR";

function normalizeRaydiumBetaPoolInfoResponse(response) {
  if (!response || typeof response !== "object") {
    return [];
  }

  const items = Array.isArray(response)
    ? response
    : Array.isArray(response.data)
    ? response.data
    : [];

  return items.filter(
    (p) => p && p.price && p.mintAmountA && p.mintAmountB && p.mintA && p.mintB
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
  }
}

const getMarketId = async () => {
  const tokenPool = normalizeRaydiumBetaPoolInfoResponse(
    await fetchPoolInfo(tokenMint)
  ).find((p) => p.mintA.address === tokenMint || p.mintB.address === tokenMint);

  console.log("tokenPool: ", tokenPool);

  const marketId = tokenPool.marketId;

  const poolInfo = await retryFetchPoolKeys(marketId);
  console.log("poolInfo", poolInfo);
};

getMarketId();
