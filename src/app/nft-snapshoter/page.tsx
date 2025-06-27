"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageIcon, Download, Search, BarChart3, Users, Copy } from "lucide-react";
import { NFTCollectionForm } from "@/components/nft/nft-collection-form";
import { NFTOwnersList } from "@/components/nft/nft-owners-list";
import { NFTCollectionStats } from "@/components/nft/nft-collection-stats";
import type { NFTCollectionFormData } from "@/types/nft";

export default function NFTSnapshoterPage() {
  const [currentContract, setCurrentContract] = useState<string | null>(null);

  const handleFormSubmit = async (data: NFTCollectionFormData) => {
    setCurrentContract(data.contractAddress);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg w-fit">
            <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">NFT Snapshoter</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Capture and analyze NFT collections
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2">
          <div className="h-full">
            <NFTCollectionForm onSubmit={handleFormSubmit} />
          </div>
        </div>

        {/* Stats Section */}
        <div className="lg:col-span-1">
          <div className="h-full">
            {currentContract ? (
              <NFTCollectionStats contractAddress={currentContract} />
            ) : (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Quick Stats
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Collection statistics will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Total NFTs
                    </span>
                    <span className="font-semibold text-sm sm:text-base">--</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Unique Holders
                    </span>
                    <span className="font-semibold text-sm sm:text-base">--</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Token Type
                    </span>
                    <span className="font-semibold text-sm sm:text-base">--</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Deployer
                    </span>
                    <span className="font-semibold text-sm sm:text-base">--</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* NFT Owners List */}
      {currentContract && (
        <div className="mt-4 sm:mt-6 lg:mt-8">
          <NFTOwnersList contractAddress={currentContract} />
        </div>
      )}

      {/* Features Preview */}
      <div className="mt-6 sm:mt-8 lg:mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">
              What You Can Do
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm lg:text-base">
              Explore the powerful features of our NFT Snapshoter tool
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <div className="text-center p-3 sm:p-4 lg:p-6">
                <div className="p-2 sm:p-3 rounded-lg bg-blue-100 text-blue-600 w-fit mx-auto mb-2 sm:mb-3">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                  Collection Analysis
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Get detailed insights into NFT collections including ownership
                  distribution, token types, and holder statistics.
                </p>
              </div>

              <div className="text-center p-3 sm:p-4 lg:p-6">
                <div className="p-2 sm:p-3 rounded-lg bg-green-100 text-green-600 w-fit mx-auto mb-2 sm:mb-3">
                  <Download className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                  Export Data
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Download snapshot data in CSV, JSON, or airdrop formats for
                  further analysis, integration, or distribution.
                </p>
              </div>

              <div className="text-center p-3 sm:p-4 lg:p-6">
                <div className="p-2 sm:p-3 rounded-lg bg-purple-100 text-purple-600 w-fit mx-auto mb-2 sm:mb-3">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                  Holder Discovery
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Find and analyze NFT holders with search functionality, sorting
                  by token count, and detailed holder information.
                </p>
              </div>

              <div className="text-center p-3 sm:p-4 lg:p-6">
                <div className="p-2 sm:p-3 rounded-lg bg-orange-100 text-orange-600 w-fit mx-auto mb-2 sm:mb-3">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                  Collection Stats
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  View comprehensive collection statistics including total supply,
                  unique holders, token types, and deployment details.
                </p>
              </div>

              <div className="text-center p-3 sm:p-4 lg:p-6">
                <div className="p-2 sm:p-3 rounded-lg bg-indigo-100 text-indigo-600 w-fit mx-auto mb-2 sm:mb-3">
                  <Copy className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                  Quick Actions
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Copy addresses, explore on blockchain, and access external
                  links for seamless workflow integration.
                </p>
              </div>

              <div className="text-center p-3 sm:p-4 lg:p-6">
                <div className="p-2 sm:p-3 rounded-lg bg-teal-100 text-teal-600 w-fit mx-auto mb-2 sm:mb-3">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                  Smart Search
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Search through thousands of holders instantly with real-time
                  filtering and responsive pagination for large collections.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
