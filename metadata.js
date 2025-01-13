// const Metaplex = require("@metaplex-foundation/js").Metaplex;
// const { Connection, PublicKey } = require("@solana/web3.js");
// require("dotenv").config();

// async function getTokenMetadata() {
//   const connection = new Connection(process.env.RPC_URL || "", {
//     commitment: "confirmed",
//     maxSupportedTransactionVersion: 0,
//   });
//   const metaplex = Metaplex.make(connection);

//   const mintAddress = new PublicKey(process.env.TOKEN_ADDRESS);

//   let tokenName;
//   let tokenSymbol;
//   let tokenLogo;

//   const metadataAccount = metaplex
//     .nfts()
//     .pdas()
//     .metadata({ mint: mintAddress });

//   console.log("metadataAccount: ", metadataAccount);

//   const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

//   console.log("metadataAccountInfo: ", metadataAccountInfo);

//   if (metadataAccountInfo) {
//     const token = await metaplex
//       .nfts()
//       .findByMint({ mintAddress: mintAddress });

//     console.log("token: ", token);

//     tokenName = token.name;
//     tokenSymbol = token.symbol;
//     tokenLogo = token.json.image;
//   }
// }

// getTokenMetadata();

const Metaplex = require("@metaplex-foundation/js").Metaplex;
const { Connection, PublicKey } = require("@solana/web3.js");
const { ENV, TokenListProvider } = require("@solana/spl-token-registry");
require("dotenv").config();

async function getTokenMetadata() {
  const connection = new Connection(process.env.RPC_URL || "", {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0,
  });
  const metaplex = Metaplex.make(connection);

  const mintAddress = new PublicKey(process.env.TOKEN_ADDRESS);

  let tokenName;
  let tokenSymbol;
  let tokenLogo;

  const metadataAccount = metaplex
    .nfts()
    .pdas()
    .metadata({ mint: mintAddress });

  const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

  if (metadataAccountInfo) {
    const token = await metaplex
      .nfts()
      .findByMint({ mintAddress: mintAddress });

    console.log("token: ", token.json);
    tokenName = token.name;
    tokenSymbol = token.symbol;
    tokenLogo = token.json?.image;
  } else {
    const provider = await new TokenListProvider().resolve();
    const tokenList = provider.filterByChainId(ENV.MainnetBeta).getList();
    console.log(tokenList);
    const tokenMap = tokenList.reduce((map, item) => {
      map.set(item.address, item);
      return map;
    }, new Map());

    const token = tokenMap.get(mintAddress.toBase58());

    tokenName = token.name;
    tokenSymbol = token.symbol;
    tokenLogo = token.logoURI;
  }
}

getTokenMetadata();
