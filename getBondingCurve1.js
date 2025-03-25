const {
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");
const {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} = require("@solana/spl-token");
require("dotenv").config();

const TOKEN_ADDRESS = "B1XB6wLe5vmKf3MSpCm4MnDB8vbH6MnTKFfR1VRbpump";

const getBondingCurve = async () => {
  const PUMP_FUN_PROGRAM = new PublicKey(
    "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
  );
  const PUMP_FUN_ACCOUNT = new PublicKey(
    "Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1"
  );

  const mint_account = new PublicKey(TOKEN_ADDRESS).toBytes();

  const [bondingCurve] = PublicKey.findProgramAddressSync(
    [Buffer.from("bonding-curve"), mint_account],
    PUMP_FUN_PROGRAM
  );

  const [associatedBondingCurve] = PublicKey.findProgramAddressSync(
    [bondingCurve.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint_account],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  console.log("Bonding Curve", bondingCurve.toBase58());
  console.log("Associated Program", associatedBondingCurve.toBase58());
};

getBondingCurve();
