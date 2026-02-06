import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, AlertCircle, CheckCircle, Clock } from "lucide-react";

function getDashboardStats(organizationId: string) {
  return unstable_cache(
    async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const [totalServices, activeIncidents, resolvedToday, operationalServices] =
        await Promise.all([
          prisma.service.count({ where: { organizationId } }),
          prisma.incident.count({
            where: {
              organizationId,
              status: { not: "RESOLVED" },
            },
          }),
          prisma.incident.count({
            where: {
              organizationId,
              status: "RESOLVED",
              resolvedAt: { gte: todayStart },
            },
          }),
          prisma.service.count({
            where: { organizationId, status: "OPERATIONAL" },
          }),
        ]);
      return {
        totalServices,
        activeIncidents,
        resolvedToday,
        operationalServices,
      };
    },
    ["dashboard-stats", organizationId],
    { revalidate: 30 }
  )();
}

export default async function DashboardPage() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard");
  }

  const effectiveOrgId = orgId ?? userId;

  const org = await prisma.organization.upsert({
    where: { clerkOrgId: effectiveOrgId },
    update: {},
    create: {
      clerkOrgId: effectiveOrgId,
      name: "My Organization",
      slug: effectiveOrgId.toLowerCase(),
    },
  });

  const stats = await getDashboardStats(org.id);
  const {
    totalServices,
    activeIncidents,
    resolvedToday,
    operationalServices,
  } = stats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Monitor your services at a glance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Server className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-gray-500">
              {operationalServices} operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIncidents}</div>
            <p className="text-xs text-gray-500">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedToday}</div>
            <p className="text-xs text-gray-500">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity would go here */}
    </div>
  );
}