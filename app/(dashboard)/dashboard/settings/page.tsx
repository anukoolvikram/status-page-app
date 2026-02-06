import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrganizationProfile } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Incident } from "@prisma/client";


export default async function SettingsPage() {
  const { userId, orgId } = await auth();

  // Require login first
  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard/settings");
  }

  // Allow fallback workspace if org not selected
  const effectiveOrgId = orgId ?? userId;

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: effectiveOrgId },
    include: {
      services: true,
      incidents: true,
    },
  });

  if (!org) redirect("/dashboard");

  const activeIncidents = org.incidents.filter(
    (i: Incident) => i.status !== "RESOLVED"
  ).length;
  

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">
          Manage your organization and team settings
        </p>
      </div>

      {/* Organization Info */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
          <CardDescription>
            Your public status page and organization details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Organization Name
              </p>
              <p className="text-lg font-semibold">{org.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Status Page Slug
              </p>
              <p className="text-lg font-mono">{org.slug}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">
              Public Status Page URL
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-gray-100 px-3 py-2 text-sm">
                {process.env.NEXT_PUBLIC_APP_URL ||
                  "http://localhost:3000"}
                /status/{org.slug}
              </code>
              <a
                href={`/status/${org.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View →
              </a>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-gray-500">
                Total Services
              </p>
              <p className="text-2xl font-bold">
                {org.services.length}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-gray-500">
                Total Incidents
              </p>
              <p className="text-2xl font-bold">
                {org.incidents.length}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-gray-500">
                Active Incidents
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {activeIncidents}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Page Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Status Page Customization</CardTitle>
          <CardDescription>
            Customize how your status page appears
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-gray-500">
              Status page customization options coming soon!
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Future: custom domain, branding, notifications
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Clerk Team Management */}
      <Card>
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
          <CardDescription>
            Manage team members and roles
          </CardDescription>
        </CardHeader>
        <CardContent>
        <OrganizationProfile
            routing="hash"
            appearance={{
                elements: {
                rootBox: "w-full",
                card: "border-0 shadow-none",
                },
            }}
        />

        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible organization actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-red-900">
                  Delete Organization
                </p>
                <p className="text-sm text-red-700">
                  This will permanently delete all services,
                  incidents, and related data.
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-red-300 text-red-700"
              >
                Disabled
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
