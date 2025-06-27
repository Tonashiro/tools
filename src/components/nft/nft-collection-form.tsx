"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageIcon, Search } from "lucide-react";
import type { NFTCollectionFormData } from "@/types/nft";

interface NFTCollectionFormProps {
  onSubmit: (data: NFTCollectionFormData) => void;
  isLoading?: boolean;
}

export function NFTCollectionForm({
  onSubmit,
  isLoading = false,
}: NFTCollectionFormProps) {
  const [contractAddress, setContractAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate contract address
    if (!contractAddress) {
      newErrors.contractAddress = "Contract address is required";
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      newErrors.contractAddress = "Invalid contract address format";
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
        contractAddress,
      });
    } finally {
      setIsSubmitting(false);
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
          Enter the contract address to start capturing NFT data
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
          <div className="space-y-2">
            <label htmlFor="contract-address" className="text-xs sm:text-sm font-medium">
              Contract Address *
            </label>
            <Input
              id="contract-address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
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
              The Monad contract address of the NFT collection
            </p>
          </div>

          <div className="pt-1 sm:pt-2">
            <Button
              type="submit"
              className="w-full text-sm sm:text-base"
              size="lg"
              disabled={isLoading || isSubmitting || !contractAddress}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              {isSubmitting ? "Capturing..." : "Capture Snapshot"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
