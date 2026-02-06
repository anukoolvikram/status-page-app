import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceEditForm } from "@/components/dashboard/service-edit-form";
import { unstable_noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  unstable_noStore();

  const { serviceId } = await params;

  const { userId, orgId } = await auth();
  if (!userId) {
    redirect(
      `/sign-in?redirect_url=/dashboard/services/${encodeURIComponent(serviceId)}`
    );
  }

  const effectiveOrgId = orgId ?? userId;

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: effectiveOrgId },
  });

  if (!org) redirect("/dashboard");

  const service = await prisma.service.findFirst({
    where: { id: serviceId, organizationId: org.id },
  });

  if (!service) notFound();

  return <ServiceEditForm key={service.id} service={service} />;
}
