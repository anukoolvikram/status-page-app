import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { unstable_noStore } from "next/cache";

import type { Incident, IncidentUpdate, Service } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

/**
 * Explicit relation typing (fixes TS build errors)
 */
type IncidentWithRelations = Incident & {
  service: Service;
  updates: IncidentUpdate[];
};

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ incidentId: string }>;
}) {
  // Prevent RSC caching issues
  unstable_noStore();

  const { incidentId } = await params;

  const { userId, orgId } = await auth();

  if (!userId) {
    redirect(
      `/sign-in?redirect_url=/dashboard/incidents/${encodeURIComponent(
        incidentId
      )}`
    );
  }

  const effectiveOrgId = orgId ?? userId;

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: effectiveOrgId },
  });

  if (!org) redirect("/dashboard");

  const incident: IncidentWithRelations | null =
    await prisma.incident.findFirst({
      where: {
        id: incidentId,
        organizationId: org.id,
      },
      include: {
        service: true,
        updates: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

  if (!incident) notFound();

  const statusColors: Record<string, string> = {
    INVESTIGATING: "bg-yellow-500",
    IDENTIFIED: "bg-orange-500",
    MONITORING: "bg-blue-500",
    RESOLVED: "bg-green-500",
    SCHEDULED: "bg-purple-500",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{incident.title}</h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>{incident.service.name}</span>
            <span>•</span>
            <span>
              Created{" "}
              {formatDistanceToNow(incident.createdAt, {
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{incident.impact}</Badge>
            <Badge className={statusColors[incident.status] ?? ""}>
              {incident.status}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/incidents">Back</Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/incidents/${incident.id}/edit`}>
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Description</h2>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm text-gray-700">
            {incident.description}
          </p>
        </CardContent>
      </Card>

      {/* Updates */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Updates</h2>

        {incident.updates.length === 0 ? (
          <p className="text-sm text-gray-500">
            No updates yet.
          </p>
        ) : (
          <div className="space-y-3">
            {incident.updates.map((u: IncidentUpdate) => (
              <Card key={u.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={statusColors[u.status] ?? ""}>
                      {u.status}
                    </Badge>

                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(u.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="whitespace-pre-wrap text-sm text-gray-700">
                    {u.message}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
