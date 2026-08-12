import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Bell, CalendarClock, Megaphone, MessageSquare, Plus, RadioTower } from "lucide-react";

import prisma from "@/db";
import { auth } from "@/lib/auth";
import { ArchiveCampaignButton } from "@/components/campaigns/ArchiveCampaignButton";

export default async function CampaignsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/getstarted");

  const campaigns = await prisma.campaign.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      revisions: { orderBy: { revision: "desc" }, take: 1 },
      targets: { include: { website: { select: { name: true } } } },
      _count: { select: { deliveryEvents: true } },
    },
  });

  return (
    <main className="min-h-screen bg-[#080a0f] px-4 py-8 text-[#f3f3ee] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"><ArrowLeft size={15} /> Workspace</Link>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.18em] text-[#70f0c0]"><RadioTower size={14} /> Durable feed</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-.04em]">Campaigns</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">Every successful publish is an immutable revision your visitors can retrieve—even if they were offline when you created it.</p>
          </div>
          <div className="flex gap-2">
            <CreateLink href="/toast" icon={Bell}>Toast</CreateLink>
            <CreateLink href="/alert" icon={Megaphone}>Banner</CreateLink>
            <CreateLink href="/alert_dialog" icon={MessageSquare}>Dialog</CreateLink>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-white/15 bg-[#0d1118] p-8 text-center">
            <div><div className="mx-auto grid size-12 place-items-center rounded-xl bg-[#70f0c0]/10 text-[#70f0c0]"><Plus size={20} /></div><h2 className="mt-5 text-xl font-medium">Publish your first durable campaign</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">Choose a format, style the client preview, and target a verified site.</p></div>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign) => {
              const revision = campaign.revisions[0];
              return (
                <article key={campaign.id} className="grid gap-5 rounded-2xl border border-white/10 bg-[#0d1118] p-5 transition hover:border-white/20 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><span className={`rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[.12em] ${campaign.status === "PUBLISHED" ? "bg-[#70f0c0]/10 text-[#70f0c0]" : "bg-white/5 text-white/40"}`}>{campaign.status.toLowerCase()}</span><span className="font-mono text-[10px] uppercase tracking-[.12em] text-white/30">revision {campaign.currentRevision}</span><span className="font-mono text-[10px] uppercase tracking-[.12em] text-white/30">{revision?.preset.toLowerCase()}</span></div>
                    <h2 className="mt-3 truncate text-lg font-medium">{revision?.title ?? "Untitled campaign"}</h2>
                    <p className="mt-1 line-clamp-1 text-sm text-white/45">{revision?.description}</p>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/35"><span>{campaign.targets.map((target) => target.website.name).join(", ")}</span><span>{campaign._count.deliveryEvents} recorded events</span><span className="inline-flex items-center gap-1.5"><CalendarClock size={13} /> {campaign.startsAt.toLocaleString()}</span></div>
                  </div>
                  {campaign.status === "PUBLISHED" ? <ArchiveCampaignButton campaignId={campaign.id} /> : null}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function CreateLink({ href, icon: Icon, children }: { href: string; icon: typeof Bell; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[.035] px-3 text-xs text-white/65 transition hover:border-[#70f0c0]/50 hover:text-white"><Icon size={14} />{children}</Link>;
}
