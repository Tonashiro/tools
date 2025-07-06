"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateSnapshot } from "@/hooks/use-snapshots";
import type { NFTOwner, NFTContractMetadata, Network } from "@/types/nft";

interface SaveSnapshotButtonProps {
  contractAddress: string;
  network: Network;
  owners: NFTOwner[];
  metadata: NFTContractMetadata | null;
  totalOwners: number;
  totalTokens: number;
  disabled?: boolean;
  snapshotName?: string;
}

export function SaveSnapshotButton({
  contractAddress,
  network,
  owners,
  metadata,
  totalOwners,
  totalTokens,
  disabled = false,
  snapshotName: initialSnapshotName = "",
}: SaveSnapshotButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [snapshotName, setSnapshotName] = useState(initialSnapshotName);
  const router = useRouter();
  const createSnapshot = useCreateSnapshot();

  // Sync with external snapshotName prop
  useEffect(() => {
    setSnapshotName(initialSnapshotName);
  }, [initialSnapshotName]);

  const handleSave = async () => {
    if (!snapshotName.trim()) return;

    try {
      await createSnapshot.mutateAsync({
        name: snapshotName.trim(),
        contractAddress,
        network,
        totalOwners,
        totalTokens,
        tokenType: metadata?.tokenType || "ERC721",
        collectionName: metadata?.name || undefined,
        collectionSymbol: metadata?.symbol || undefined,
        snapshotData: {
          owners,
          metadata: metadata
            ? {
                name: metadata.name || undefined,
                symbol: metadata.symbol || undefined,
                totalSupply: metadata.totalSupply || undefined,
                tokenType: metadata.tokenType || undefined,
                contractDeployer: metadata.contractDeployer || undefined,
                deployedBlockNumber: metadata.deployedBlockNumber || undefined,
              }
            : undefined,
        },
      });

      toast.success(`"${snapshotName}" saved successfully!`);
      setIsOpen(false);
      setSnapshotName("");
      // Redirect to my-snapshots page
      router.push("/my-snapshots");
    } catch (error) {
      console.error("Failed to save snapshot:", error);
      toast.error("Failed to save snapshot. Please try again.");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSnapshotName(initialSnapshotName);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || !owners.length}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save Snapshot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Snapshot</DialogTitle>
          <DialogDescription>
            Save this NFT collection snapshot for later reference. Give it a
            meaningful name.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              placeholder="My Collection Snapshot"
              className="col-span-3"
              disabled={createSnapshot.isPending}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Collection:</strong> {metadata?.name || contractAddress}
            </p>
            <p>
              <strong>Network:</strong> {network}
            </p>
            <p>
              <strong>Owners:</strong> {totalOwners.toLocaleString()}
            </p>
            <p>
              <strong>Tokens:</strong> {totalTokens.toLocaleString()}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={createSnapshot.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!snapshotName.trim() || createSnapshot.isPending}
          >
            {createSnapshot.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Snapshot"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
