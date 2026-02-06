import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus, Server } from "lucide-react";
import Link from "next/link";
import { ServiceCard } from "@/components/dashboard/service-card";
import type { Service } from "@prisma/client";

function getCachedServices(organizationId: string) {
  return unstable_cache(
    async () =>
      prisma.service.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
      }),
    ["dashboard-services", organizationId],
    { revalidate: 30 }
  )();
}

export default async function ServicesPage() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard/services");
  }

  const effectiveOrgId = orgId ?? userId;

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: effectiveOrgId },
  });

  if (!org) {
    redirect("/dashboard");
  }

  const services = await getCachedServices(org.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-gray-500">Manage your monitored services</p>
        </div>
        <Link href="/dashboard/services/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Server className="h-10 w-10 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold">No services yet</h3>
          <p className="mb-4 mt-2 text-sm text-gray-500">
            Get started by creating your first service.
          </p>
          <Link href="/dashboard/services/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}