import { verifySIWA as verifySIWALib } from "@buildersgarden/siwa";
import { ethers } from "ethers";

const DOMAIN = process.env.SIWA_DOMAIN ?? "localhost";
const RPC_URL = process.env.RPC_URL ?? "https://mainnet.base.org";

const provider = new ethers.JsonRpcProvider(RPC_URL);

export async function verifySiwa(
  message: string,
  signature: string,
): Promise<{ address: string; valid: boolean }> {
  const result = await verifySIWALib(
    message,
    signature,
    DOMAIN,
    () => true,
    provider,
  );

  return {
    address: result.address,
    valid: result.valid,
  };
}
