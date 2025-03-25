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

const getBondingCurve = async () => {
<<<<<<< HEAD
  // const connection = new Connection(process.env.RPC_URL || "", "confirmed");

  // Specify maxSupportedTransactionVersion in the connection configuration
=======
>>>>>>> faeec5ca35eee68292c202c24caa72adc80ba7c8
  const connection = new Connection(process.env.RPC_URL || "", {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0,
  });

  const PUMP_FUN_PROGRAM = new PublicKey(
    "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
  );
  const PUMP_FUN_ACCOUNT = new PublicKey(
    "Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1"
  );

  const mint_account = new PublicKey(process.env.TOKEN_ADDRESS).toBytes();

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

  await getTokenCreationDate();
};

const getTokenCreationDate = async () => {
  const connection = new Connection(process.env.RPC_URL || "", {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0,
  });

  // Assuming TOKEN_ADDRESS is the public key of the token's mint account.
  const mintPublicKey = new PublicKey(process.env.TOKEN_ADDRESS);

  try {
    // Fetch signatures for transactions related to the mint account
    const signatures = await connection.getSignaturesForAddress(mintPublicKey);

    if (signatures.length === 0) {
      console.log("No transactions found for this token.");
      return;
    }

    // Since we're interested in the token creation, we should look at the earliest available signature
    const oldestSignature = signatures[signatures.length - 1].signature;

    // Retrieve the transaction details of this signature
    const transactionDetails = await connection.getTransaction(
      oldestSignature,
      {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      }
    );
<<<<<<< HEAD
    console.log({ transactionDetails });
=======

>>>>>>> faeec5ca35eee68292c202c24caa72adc80ba7c8
    if (transactionDetails && transactionDetails.blockTime) {
      console.log(
        `Token Creation Timestamp:`,
        transactionDetails.blockTime * 1000
      );
    } else {
      console.log("Failed to retrieve transaction details.");
    }
  } catch (error) {
    console.error("Error fetching token creation date:", error);
  }
};

getBondingCurve();
