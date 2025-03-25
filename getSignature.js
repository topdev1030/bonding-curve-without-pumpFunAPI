const { Connection, PublicKey } = require("@solana/web3.js");

// Initialize Solana connection
const connection = new Connection("https://api.mainnet-beta.solana.com");

// Token and Raydium Pool Details
const TOKEN_MINT_ADDRESS = "9R3EYfKhT2gwdLsGgW1wdj3ZawiVCqbUtPGwfiJEpump"; // Replace with Pump Fun token mint address
const RAYDIUM_POOL_ADDRESS = "YourRaydiumPoolAddressHere"; // Replace with Raydium pool address

// Fetch recent transactions for an account
async function getTransactions(accountAddress, limit = 10) {
  const publicKey = new PublicKey(accountAddress);
  try {
    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit,
    });
    return signatures;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

// Fetch and decode transaction details
async function getTransactionDetails(signature) {
  try {
    const transaction = await connection.getTransaction(signature, {
      commitment: "confirmed",
    });
    return transaction;
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    return null;
  }
}

// Parse and log transaction instructions
function parseInstructions(transaction) {
  if (!transaction) return;

  const instructions = transaction.transaction.message.instructions;
  for (const instr of instructions) {
    const programId = instr.programId.toString();
    const data = instr.data; // Encoded data (base64)
    if (data) {
      const decodedData = Buffer.from(data, "base64").toString("hex");
      console.log(`Program ID: ${programId}, Decoded Data: ${decodedData}`);
    }
  }
}

// Main function to process transactions
(async () => {
  try {
    // Fetch recent transactions
    const transactions = await getTransactions(TOKEN_MINT_ADDRESS, 5);

    for (const tx of transactions) {
      console.log(`\nTransaction Signature: ${tx.signature}`);
      const txDetails = await getTransactionDetails(tx.signature);
      parseInstructions(txDetails);
    }
  } catch (error) {
    console.error("Error processing transactions:", error);
  }
})();
