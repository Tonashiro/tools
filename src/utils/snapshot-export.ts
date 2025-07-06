import type { Snapshot } from '@/types/snapshot';

export function downloadSnapshotCSV(snapshot: Snapshot): void {
  try {
    // Transform the snapshot data for CSV export
    const csvData = snapshot.snapshotData.owners.map((owner) => ({
      address: owner.address,
      totalTokens: owner.totalTokens,
      tokenDetails: owner.tokens.map(token => `${token.tokenId}:${token.balance}`).join(';'),
    }));

    // Generate CSV content
    const csvHeaders = ['Address', 'Total Tokens', 'Token Details (TokenID:Balance)'];
    const csvRows = csvData.map(row => [
      row.address,
      row.totalTokens,
      row.tokenDetails
    ]);

    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snapshot-${snapshot.name}-${snapshot.contractAddress.slice(0, 8)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading snapshot CSV:', error);
    throw new Error('Failed to download CSV file');
  }
}

export function downloadSnapshotJSON(snapshot: Snapshot): void {
  try {
    // Transform the snapshot data for JSON export
    const jsonData = {
      snapshotName: snapshot.name,
      contractAddress: snapshot.contractAddress,
      network: snapshot.network,
      exportDate: new Date().toISOString(),
      tokenType: snapshot.tokenType,
      totalHolders: snapshot.totalOwners,
      totalTokens: snapshot.totalTokens,
      collectionName: snapshot.collectionName,
      collectionSymbol: snapshot.collectionSymbol,
      snapshotCreatedAt: snapshot.createdAt,
      owners: snapshot.snapshotData.owners.map((owner) => ({
        address: owner.address,
        totalTokens: owner.totalTokens,
        tokens: owner.tokens.map((token) => ({
          tokenId: token.tokenId,
          balance: token.balance,
        })),
      })),
    };

    // Create and download the file
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snapshot-${snapshot.name}-${snapshot.contractAddress.slice(0, 8)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading snapshot JSON:', error);
    throw new Error('Failed to download JSON file');
  }
}

export function downloadSnapshotAirdropList(snapshot: Snapshot, format: 'txt' | 'json' = 'txt'): void {
  try {
    // Extract addresses for airdrop
    const addresses = snapshot.snapshotData.owners.map(owner => owner.address);

    if (format === 'json') {
      // JSON format with metadata
      const jsonData = {
        snapshotName: snapshot.name,
        contractAddress: snapshot.contractAddress,
        network: snapshot.network,
        exportDate: new Date().toISOString(),
        totalAddresses: addresses.length,
        addresses: addresses,
      };

      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `airdrop-${snapshot.name}-${snapshot.contractAddress.slice(0, 8)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      // Plain text format - one address per line
      const textContent = addresses.join('\n');

      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `airdrop-${snapshot.name}-${snapshot.contractAddress.slice(0, 8)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error downloading snapshot airdrop list:', error);
    throw new Error('Failed to download airdrop list file');
  }
} 