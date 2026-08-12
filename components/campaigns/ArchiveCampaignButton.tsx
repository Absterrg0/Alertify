"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function ArchiveCampaignButton({ campaignId }: { campaignId: string }) {
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
    <Button onClick={archive} disabled={pending} size="sm" variant="ghost" className="text-white/45 hover:bg-white/5 hover:text-white">
      {pending ? <LoaderCircle className="mr-2 animate-spin" size={14} /> : <Archive className="mr-2" size={14} />}
      Archive
    </Button>
  );
}
