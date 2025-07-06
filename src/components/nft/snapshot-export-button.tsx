"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  downloadSnapshotCSV,
  downloadSnapshotJSON,
  downloadSnapshotAirdropList,
} from "@/utils/snapshot-export";
import type { Snapshot } from "@/types/snapshot";

interface SnapshotExportButtonProps {
  snapshot: Snapshot;
  disabled?: boolean;
}

export function SnapshotExportButton({
  snapshot,
  disabled = false,
}: SnapshotExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'json' | 'airdrop-txt' | 'airdrop-json') => {
    if (!snapshot) return;
    
    setIsExporting(true);
    try {
      if (format === 'csv') {
        downloadSnapshotCSV(snapshot);
        toast.success(`"${snapshot.name}" exported as CSV successfully`);
      } else if (format === 'json') {
        downloadSnapshotJSON(snapshot);
        toast.success(`"${snapshot.name}" exported as JSON successfully`);
      } else if (format === 'airdrop-txt') {
        downloadSnapshotAirdropList(snapshot, 'txt');
        toast.success(`"${snapshot.name}" airdrop list exported as TXT successfully`);
      } else if (format === 'airdrop-json') {
        downloadSnapshotAirdropList(snapshot, 'json');
        toast.success(`"${snapshot.name}" airdrop list exported as JSON successfully`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Failed to export "${snapshot.name}". Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={disabled || isExporting}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isExporting ? 'Exporting...' : 'Export'}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('airdrop-txt')}>
          Airdrop List (TXT)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('airdrop-json')}>
          Airdrop List (JSON)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 