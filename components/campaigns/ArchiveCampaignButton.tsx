"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, LoaderCircle } from "lucide-react";
import type { MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ArchiveCampaignButton({ campaignId, onClick }: { campaignId: string; onClick?: (event: MouseEvent<HTMLButtonElement>) => void }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const archive = async () => {
    setPending(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, { method: "DELETE" });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Unable to archive campaign");
      toast({ title: "Campaign archived", description: "Its target feeds were updated." });
      router.refresh();
    } catch (error) {
      toast({
        title: "Archive failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button onClick={onClick} disabled={pending} size="sm" variant="ghost" className="workspace-archive-button">
          {pending ? <LoaderCircle className="mr-2 animate-spin" size={14} /> : <Archive className="mr-2" size={14} />}
          Archive
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="workspace-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Archive this campaign?</AlertDialogTitle>
          <AlertDialogDescription>Archiving removes the record from active site feeds. Its immutable revision and recorded events remain available in the registry.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="workspace-button workspace-button--quiet">Cancel</AlertDialogCancel>
          <AlertDialogAction className="workspace-button workspace-button--danger" onClick={() => void archive()}>Archive campaign</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
