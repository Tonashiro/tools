"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteSnapshot } from "@/hooks/use-snapshots";
import type { Snapshot } from "@/types/snapshot";

interface DeleteSnapshotDialogProps {
  snapshot: Snapshot;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteSnapshotDialog({
  snapshot,
  isOpen,
  onClose,
}: DeleteSnapshotDialogProps) {
  const deleteSnapshot = useDeleteSnapshot();

  const handleDelete = async () => {
    try {
      await deleteSnapshot.mutateAsync(snapshot.id);
      // Close the dialog first
      onClose();
      // Then show the toast
      setTimeout(() => {
        toast.success(`"${snapshot.name}" deleted successfully`);
      }, 100);
    } catch (error) {
      console.error("Failed to delete snapshot:", error);
      toast.error("Failed to delete snapshot. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Snapshot
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{snapshot.name}&rdquo;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Collection:</strong>{" "}
              {snapshot.collectionName || snapshot.contractAddress}
            </p>
            <p>
              <strong>Network:</strong> {snapshot.network}
            </p>
            <p>
              <strong>Owners:</strong> {snapshot.totalOwners.toLocaleString()}
            </p>
            <p>
              <strong>Tokens:</strong> {snapshot.totalTokens.toLocaleString()}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteSnapshot.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteSnapshot.isPending}
          >
            {deleteSnapshot.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Snapshot
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
