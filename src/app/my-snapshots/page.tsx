"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSnapshots } from "@/hooks/use-snapshots";
import { DeleteSnapshotDialog } from "@/components/nft/delete-snapshot-dialog";
import { SnapshotExportButton } from "@/components/nft/snapshot-export-button";
import { AuthPrompt } from "@/components/auth/auth-prompt";
import {
  BookOpen,
  Users,
  Package,
  Calendar,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import type { Snapshot } from "@/types/snapshot";

export default function MySnapshotsPage() {
  const { data: session, status } = useSession();
  const { data: snapshots, isLoading } = useSnapshots();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    snapshot: Snapshot | null;
  }>({
    isOpen: false,
    snapshot: null,
  });

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const handleDeleteClick = (snapshot: Snapshot) => {
    setDeleteDialog({
      isOpen: true,
      snapshot,
    });
  };

  const handleDeleteClose = () => {
    setDeleteDialog({
      isOpen: false,
      snapshot: null,
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Skeleton className="h-8 w-48" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AuthPrompt
          title="My Snapshots"
          description="Sign in with Discord to view your saved NFT collection snapshots"
          icon={BookOpen}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Snapshots</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {session.user?.username || "User"}! Here are your
              saved NFT collection snapshots.
            </p>
          </div>
        </div>
      </div>

      {/* Snapshots Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : snapshots && snapshots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snapshots.map((snapshot: Snapshot) => (
            <Card
              key={snapshot.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{snapshot.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {snapshot.collectionName ||
                        formatWalletAddress(snapshot.contractAddress)}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(snapshot)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{snapshot.totalOwners.toLocaleString()} owners</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{snapshot.totalTokens.toLocaleString()} tokens</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(snapshot.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyAddress(snapshot.contractAddress)}
                    className="flex-1"
                  >
                    {copiedAddress === snapshot.contractAddress ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    Copy Address
                  </Button>
                  <SnapshotExportButton snapshot={snapshot} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No snapshots yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by creating your first NFT collection snapshot
            </p>
            <Button onClick={() => (window.location.href = "/nft-snapshotter")}>
              Create Snapshot
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog */}
      {deleteDialog.snapshot && (
        <DeleteSnapshotDialog
          snapshot={deleteDialog.snapshot}
          isOpen={deleteDialog.isOpen}
          onClose={handleDeleteClose}
        />
      )}
    </div>
  );
}
