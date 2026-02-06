import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RealTimeStatus } from "@/components/status/real-time-status";

export default async function StatusPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Important: unwrap params in Next.js 16
  const { slug } = await params;

  const org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      services: { orderBy: { name: "asc" } },
      incidents: {
        include: {
          service: true,
          updates: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!org) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{org.name} Status</h1>
        </div>

        <RealTimeStatus
          initialServices={org.services}
          initialIncidents={org.incidents}
          orgSlug={org.slug}
        />
      </div>
    </div>
  );
}
