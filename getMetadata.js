const { Metaplex } = require("@metaplex-foundation/js");
const { Connection, PublicKey } = require("@solana/web3.js");
const { ENV, TokenListProvider } = require("@solana/spl-token-registry");

const tokenAddress = "B1XB6wLe5vmKf3MSpCm4MnDB8vbH6MnTKFfR1VRbpump";

async function getTokenMetadata() {
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const metaplex = Metaplex.make(connection);

  const mintAddress = new PublicKey(tokenAddress);

  let tokenName;
  let tokenSymbol;
  let tokenLogo;

  const metadataAccount = metaplex
    .nfts()
    .pdas()
    .metadata({ mint: mintAddress });

  const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);
  let metadata;
  if (metadataAccountInfo) {
    const token = await metaplex
      .nfts()
      .findByMint({ mintAddress: mintAddress });
    tokenName = token.name;
    tokenSymbol = token.symbol;
    tokenLogo = token.json?.image;
    metadata = token.json;
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
    metadata = token.json;
  }
  console.log({ metadata });
}

getTokenMetadata();
