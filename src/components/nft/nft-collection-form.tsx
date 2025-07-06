"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ImageIcon, Search, BookOpen, Download, Loader2 } from "lucide-react";
import { AuthPrompt } from "@/components/auth/auth-prompt";
import { toast } from "sonner";
import { useCreateSnapshot } from "@/hooks/use-snapshots";
import {
  downloadSnapshotCSV,
  downloadSnapshotJSON,
  downloadSnapshotAirdropList,
} from "@/utils/snapshot-export";
import type {
  NFTCollectionFormData,
  Network,
  NFTOwner,
  EnhancedNFTContractMetadata,
} from "@/types/nft";

interface NFTCollectionFormProps {
  onSubmit: (data: NFTCollectionFormData) => void;
  isLoading?: boolean;
  // Save snapshot related props
  contractAddress?: string;
  network?: Network;
  owners?: NFTOwner[];
  metadata?: EnhancedNFTContractMetadata | null;
  totalOwners?: number;
  totalTokens?: number;
  isAuthenticated?: boolean;
  hasData?: boolean;
}

export function NFTCollectionForm({
  onSubmit,
  isLoading = false,
  contractAddress,
  network,
  owners,
  metadata,
  totalOwners = 0,
  totalTokens = 0,
  isAuthenticated = false,
  hasData = false,
}: NFTCollectionFormProps) {
  const [formContractAddress, setFormContractAddress] = useState("");
  const [formNetwork, setFormNetwork] = useState<Network>("Monad");
  const [snapshotName, setSnapshotName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createSnapshot = useCreateSnapshot();
  const hasAttemptedSave = useRef(false);

  // Auto-save snapshot when data becomes available for authenticated users
  useEffect(() => {
    if (
      isAuthenticated &&
      owners &&
      metadata &&
      contractAddress &&
      network &&
      snapshotName.trim() &&
      !hasAttemptedSave.current
    ) {
      hasAttemptedSave.current = true;

      const saveSnapshot = async () => {
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
                    deployedBlockNumber:
                      metadata.deployedBlockNumber || undefined,
                  }
                : undefined,
            },
          });

          toast.success(`"${snapshotName}" saved successfully!`);
        } catch (error) {
          console.error("Failed to save snapshot:", error);
          toast.error("Failed to save snapshot. Please try again.");
        }
      };

      saveSnapshot();
    }
  }, [
    isAuthenticated,
    owners,
    contractAddress,
    network,
    snapshotName,
    totalOwners,
    totalTokens,
    metadata,
    createSnapshot,
  ]);

  // Reset save attempt when form is submitted again
  useEffect(() => {
    if (!hasData) {
      hasAttemptedSave.current = false;
    }
  }, [hasData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate contract address
    if (!formContractAddress) {
      newErrors.contractAddress = "Contract address is required";
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formContractAddress)) {
      newErrors.contractAddress = "Invalid contract address format";
    }

    // Validate snapshot name for authenticated users
    if (isAuthenticated && !snapshotName.trim()) {
      newErrors.snapshotName = "Snapshot name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        contractAddress: formContractAddress,
        network: formNetwork,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async (
    format: "csv" | "json" | "airdrop-txt" | "airdrop-json"
  ) => {
    if (!owners || !contractAddress || !network) return;

    setIsExporting(true);
    try {
      // Create a temporary snapshot object for export
      const tempSnapshot = {
        id: "temp",
        userId: "temp",
        name: snapshotName || `${contractAddress.slice(0, 8)}...`,
        contractAddress,
        network,
        totalOwners,
        totalTokens,
        tokenType: metadata?.tokenType || "ERC721",
        collectionName: metadata?.name || null,
        collectionSymbol: metadata?.symbol || null,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (format === "csv") {
        downloadSnapshotCSV(tempSnapshot);
        toast.success(`Snapshot exported as CSV successfully`);
      } else if (format === "json") {
        downloadSnapshotJSON(tempSnapshot);
        toast.success(`Snapshot exported as JSON successfully`);
      } else if (format === "airdrop-txt") {
        downloadSnapshotAirdropList(tempSnapshot, "txt");
        toast.success(`Airdrop list exported as TXT successfully`);
      } else if (format === "airdrop-json") {
        downloadSnapshotAirdropList(tempSnapshot, "json");
        toast.success(`Airdrop list exported as JSON successfully`);
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(`Failed to export snapshot. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          Collection Details
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm lg:text-base">
          Enter the contract address and select the blockchain network
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <form
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-4 lg:space-y-6"
        >
          {/* Snapshot Name Field - only for authenticated users */}
          {isAuthenticated && (
            <div className="space-y-2">
              <label
                htmlFor="snapshot-name"
                className="text-xs sm:text-sm font-medium"
              >
                Snapshot Name *
              </label>
              <Input
                id="snapshot-name"
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                placeholder="My Awesome Collection Snapshot"
                className="text-xs sm:text-sm lg:text-base"
                disabled={isLoading || isSubmitting}
              />
              {errors.snapshotName && (
                <p className="text-xs sm:text-sm text-destructive">
                  {errors.snapshotName}
                </p>
              )}
              <p className="text-xs sm:text-sm text-muted-foreground">
                Give your snapshot a memorable name for easy reference
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="sm:col-span-2 space-y-2">
              <label
                htmlFor="contract-address"
                className="text-xs sm:text-sm font-medium"
              >
                Contract Address *
              </label>
              <Input
                id="contract-address"
                value={formContractAddress}
                onChange={(e) => setFormContractAddress(e.target.value)}
                placeholder="0x1234...5678"
                className="font-mono text-xs sm:text-sm lg:text-base"
                disabled={isLoading || isSubmitting}
              />
              {errors.contractAddress && (
                <p className="text-xs sm:text-sm text-destructive">
                  {errors.contractAddress}
                </p>
              )}
              <p className="text-xs sm:text-sm text-muted-foreground">
                The contract address of the NFT collection
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="network"
                className="text-xs sm:text-sm font-medium"
              >
                Network *
              </label>
              <Select
                value={formNetwork}
                onValueChange={(value: Network) => setFormNetwork(value)}
                disabled={isLoading || isSubmitting}
              >
                <SelectTrigger className="text-xs sm:text-sm lg:text-base">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monad">Monad</SelectItem>
                  <SelectItem value="Ethereum">Ethereum</SelectItem>
                  <SelectItem value="Base">Base</SelectItem>
                  <SelectItem value="Abstract">Abstract</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Blockchain network
              </p>
            </div>
          </div>

          <div className="pt-1 sm:pt-2">
            <Button
              type="submit"
              className="w-full text-sm sm:text-base"
              size="lg"
              disabled={
                isLoading ||
                isSubmitting ||
                !formContractAddress ||
                (isAuthenticated && !snapshotName.trim())
              }
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              {isSubmitting ? "Capturing..." : "Capture Snapshot"}
            </Button>
          </div>
        </form>

        {/* Export Section - appears below the capture button when data is available */}
        {hasData && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
            <div className="text-center mb-4">
              <h3 className="text-sm sm:text-base font-semibold mb-1">
                Export this snapshot
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Download your snapshot data in various formats
              </p>
            </div>

            {/* Individual Export Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button
                disabled={!owners?.length || isExporting}
                variant="outline"
                size="sm"
                onClick={() => handleExport("csv")}
                className="flex items-center gap-2"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export as CSV
              </Button>
              <Button
                disabled={!owners?.length || isExporting}
                variant="outline"
                size="sm"
                onClick={() => handleExport("json")}
                className="flex items-center gap-2"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export as JSON
              </Button>
              <Button
                disabled={!owners?.length || isExporting}
                variant="outline"
                size="sm"
                onClick={() => handleExport("airdrop-txt")}
                className="flex items-center gap-2"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Airdrop (TXT)
              </Button>
              <Button
                disabled={!owners?.length || isExporting}
                variant="outline"
                size="sm"
                onClick={() => handleExport("airdrop-json")}
                className="flex items-center gap-2"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Airdrop (JSON)
              </Button>
            </div>

            {owners && !isAuthenticated ? (
              <AuthPrompt
                title="Save Snapshot"
                description="Sign in with Discord to save this collection snapshot for later reference"
                icon={BookOpen}
                buttonText="Sign in to Save"
                className="mt-0"
              />
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
