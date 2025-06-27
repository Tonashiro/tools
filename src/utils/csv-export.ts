import type { NFTOwner } from "@/types/nft";

export async function downloadCSV(contractAddress: string): Promise<void> {
  try {
    // Create the download URL
    const downloadUrl = `/api/nft/export?contractAddress=${encodeURIComponent(
      contractAddress
    )}`;

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `nft-owners-${contractAddress.slice(0, 8)}.csv`;

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading CSV:", error);
    throw new Error("Failed to download CSV file");
  }
}

export async function downloadJSON(contractAddress: string): Promise<void> {
  try {
    // Create the download URL
    const downloadUrl = `/api/nft/export/json?contractAddress=${encodeURIComponent(
      contractAddress
    )}`;

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `nft-owners-${contractAddress.slice(0, 8)}.json`;

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading JSON:", error);
    throw new Error("Failed to download JSON file");
  }
}

export async function downloadAirdropList(contractAddress: string, format: 'txt' | 'json' = 'txt'): Promise<void> {
  try {
    // Create the download URL
    const downloadUrl = `/api/nft/export/airdrop?contractAddress=${encodeURIComponent(
      contractAddress
    )}&format=${format}`;

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `airdrop-list-${contractAddress.slice(0, 8)}.${format}`;

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading airdrop list:", error);
    throw new Error("Failed to download airdrop list file");
  }
}

export function formatCSVData(owners: NFTOwner[]): string {
  // CSV headers
  const headers = [
    "Address",
    "Total Tokens",
    "Token Details (TokenID:Balance)",
  ];

  // Transform data for CSV
  const rows = owners.map((owner) => [
    owner.address, // Address
    owner.tokens.length, // Total Tokens
    owner.tokens.map((token) => `${token.tokenId}:${token.balance}`).join(";"), // Token Details
  ]);

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}
