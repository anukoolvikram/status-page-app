import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { IncidentForm } from "@/components/dashboard/incident-form";

export default async function NewIncidentPage() {
  const { userId, orgId } = await auth();

  // Require authentication
  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard/incidents/new");
  }

  // Fallback workspace (supports personal users)
  const effectiveOrgId = orgId ?? userId;

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: effectiveOrgId },
  });

  if (!org) redirect("/dashboard");

  const services = await prisma.service.findMany({
    where: { organizationId: org.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Incident</h1>
        <p className="text-gray-500">
          Report a new service incident
        </p>
      </div>

      <IncidentForm services={services} />
    </div>
  );
}
