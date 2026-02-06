import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { IncidentCard } from "@/components/dashboard/incident-card";
import { Prisma } from "@prisma/client";

// Prisma relation-safe type
type IncidentWithRelations = Prisma.IncidentGetPayload<{
  include: {
    service: true;
    updates: {
      orderBy: { createdAt: "desc" };
      take: 1;
    };
  };
}>;

function getCachedIncidents(organizationId: string) {
  return unstable_cache(
    async (): Promise<IncidentWithRelations[]> =>
      prisma.incident.findMany({
        where: { organizationId },
        include: {
          service: true,
          updates: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
      }),
    ["dashboard-incidents", organizationId],
    { revalidate: 30 }
  )();
}

export default async function IncidentsPage() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard/incidents");
  }

  const effectiveOrgId = orgId ?? userId;

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: effectiveOrgId },
  });

  if (!org) redirect("/dashboard");

  const incidents = await getCachedIncidents(org.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Incidents</h1>
          <p className="text-gray-500">
            Track and manage service incidents
          </p>
        </div>

        <Link href="/dashboard/incidents/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Incident
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {incidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>
    </div>
  );
}
