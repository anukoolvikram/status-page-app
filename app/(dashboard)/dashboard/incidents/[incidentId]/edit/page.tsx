import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { IncidentEditForm } from "@/components/dashboard/incident-edit-form";
import { unstable_noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function IncidentEditPage({
  params,
}: {
  params: Promise<{ incidentId: string }>;
}) {
  // Prevent Next.js RSC caching
  unstable_noStore();

  const { incidentId } = await params;

  const { userId, orgId } = await auth();
  if (!userId) {
    redirect(
      `/sign-in?redirect_url=/dashboard/incidents/${encodeURIComponent(
        incidentId
      )}/edit`
    );
  }

  const effectiveOrgId = orgId ?? userId;

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: effectiveOrgId },
  });

  if (!org) redirect("/dashboard");

  const incident = await prisma.incident.findFirst({
    where: { id: incidentId, organizationId: org.id },
  });

  if (!incident) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Edit Incident</h1>
          <p className="text-gray-500">
            Update incident details and status
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href={`/dashboard/incidents/${incident.id}`}>
            Back
          </Link>
        </Button>
      </div>

      {/* Key forces form remount */}
      <IncidentEditForm key={incident.id} incident={incident} />
    </div>
  );
}
