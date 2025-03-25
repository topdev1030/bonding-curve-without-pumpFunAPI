const { Connection, PublicKey } = require("@solana/web3.js");
const { Market } = require("@project-serum/serum");

const connection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=cbf18dcf-67d6-4dff-af09-4444056c06e3",
  "confirmed"
);
const openbookProgramId = new PublicKey(
  "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX"
);
const rayProgram = new PublicKey(
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
);
const raydium = require("@raydium-io/raydium-sdk");
const solAddress = "So11111111111111111111111111111111111111112";
const { Liquidity, MAINNET_PROGRAM_ID } = require("@raydium-io/raydium-sdk");

const fetchPoolKeys = async (id) => {
  try {
    let seq = 1;

    const marketId = new PublicKey(id);
    const marketInfo = await connection.getAccountInfo(marketId);
    const marketDeco = await Market.getLayout(openbookProgramId).decode(
      marketInfo.data
    );

    const baseAndQuoteSwapped = !(
      marketDeco.baseMint.toBase58() === solAddress
    );

    if (!baseAndQuoteSwapped) {
      seq = 2;
    }

    const baseMint = baseAndQuoteSwapped
      ? marketDeco.baseMint
      : marketDeco.quoteMint;
    const baseMintData = await connection.getAccountInfo(baseMint);
    const baseDecimals = raydium.SPL_MINT_LAYOUT.decode(
      baseMintData.data
    ).decimals;

    const quoteMint = baseAndQuoteSwapped
      ? marketDeco.quoteMint
      : marketDeco.baseMint;
    const quoteMintData = await connection.getAccountInfo(quoteMint);
    const quoteDecimals = raydium.SPL_MINT_LAYOUT.decode(
      quoteMintData.data
    ).decimals;

    const authority = raydium.findProgramAddress(
      [
        Buffer.from([
          97, 109, 109, 32, 97, 117, 116, 104, 111, 114, 105, 116, 121,
        ]),
      ],
      rayProgram
    )["publicKey"];

    /*
        const poolKeys2 = Liquidity.getAssociatedPoolKeys({
            version: 4,
            marketVersion: 3,
            baseMint: marketDeco.baseMint,
            quoteMint: marketDeco.quoteMint,
            baseDecimals: raydium.SPL_MINT_LAYOUT.decode(baseMintData.data).decimals,
            quoteDecimals: raydium.SPL_MINT_LAYOUT.decode(quoteMintData.data).decimals,
            marketId: marketId,
            programId: MAINNET_PROGRAM_ID.AmmV4,
            marketProgramId: MAINNET_PROGRAM_ID.OPENBOOK_MARKET
        }) 

        console.log('poolKeys2', poolKeys2)

*/

    const poolKeys = {
      id: raydium.findProgramAddress(
        [
          rayProgram.toBuffer(),
          marketId.toBuffer(),
          Buffer.from("amm_associated_seed", "utf-8"),
        ],
        rayProgram
      )["publicKey"],
      baseMint: baseMint,
      quoteMint: quoteMint,
      lpMint: raydium.findProgramAddress(
        [
          rayProgram.toBuffer(),
          marketId.toBuffer(),
          Buffer.from("lp_mint_associated_seed", "utf-8"),
        ],
        rayProgram
      )["publicKey"],
      baseDecimals: baseDecimals,
      quoteDecimals: quoteDecimals,
      lpDecimals: baseDecimals,
      version: 4,
      programId: rayProgram,
      authority: authority,
      openOrders: raydium.findProgramAddress(
        [
          rayProgram.toBuffer(),
          marketId.toBuffer(),
          Buffer.from("open_order_associated_seed", "utf-8"),
        ],
        rayProgram
      )["publicKey"],
      targetOrders: raydium.findProgramAddress(
        [
          rayProgram.toBuffer(),
          marketId.toBuffer(),
          Buffer.from("target_associated_seed", "utf-8"),
        ],
        rayProgram
      )["publicKey"],
      baseVault: raydium.findProgramAddress(
        [
          rayProgram.toBuffer(),
          marketId.toBuffer(),
          Buffer.from("coin_vault_associated_seed", "utf-8"),
        ],
        rayProgram
      )["publicKey"],
      quoteVault: raydium.findProgramAddress(
        [
          rayProgram.toBuffer(),
          marketId.toBuffer(),
          Buffer.from("pc_vault_associated_seed", "utf-8"),
        ],
        rayProgram
      )["publicKey"],
      withdrawQueue: new PublicKey("11111111111111111111111111111111"),
      // withdrawQueue: poolKeys2.withdrawQueue,
      lpVault: new PublicKey("11111111111111111111111111111111"),
      // lpVault: poolKeys2.lpVault,
      marketVersion: 3,
      marketProgramId: openbookProgramId,
      marketId: marketId,
      marketAuthority: raydium.Market.getAssociatedAuthority({
        programId: new PublicKey("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX"),
        marketId: marketId,
      }).publicKey,
      marketBaseVault: marketDeco.baseVault,
      marketQuoteVault: marketDeco.quoteVault,
      marketBids: marketDeco.bids,
      marketAsks: marketDeco.asks,
      marketEventQueue: marketDeco.eventQueue,
      lookupTableAccount: PublicKey.default,
      seq,
    };

    return poolKeys;
  } catch (error) {
    console.error("Error deriving pool keys:", error);
    throw error; // Throw error to be caught by retryDerivePoolKeys
  }
};

const retryFetchPoolKeys = async (id, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchPoolKeys(id);
    } catch (error) {
      if (i < retries - 1) {
        console.log(`Retrying... (${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error("Max retries reached. Operation failed.");
        throw error;
      }
    }
  }
};

module.exports = retryFetchPoolKeys