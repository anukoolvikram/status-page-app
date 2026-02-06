"use client";

import { Incident, Service, IncidentUpdate } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type IncidentWithRelations = Incident & {
  service: Service;
  updates: IncidentUpdate[];
};

export function IncidentCard({ incident }: { incident: IncidentWithRelations }) {
  const statusColors = {
    INVESTIGATING: "bg-yellow-500",
    IDENTIFIED: "bg-orange-500",
    MONITORING: "bg-blue-500",
    RESOLVED: "bg-green-500",
    SCHEDULED: "bg-purple-500",
  };

  const impactColors = {
    MINOR: "border-yellow-200",
    MAJOR: "border-orange-200",
    CRITICAL: "border-red-200",
  };

  return (
    <Link href={`/dashboard/incidents/${incident.id}`}>
      <Card className={`cursor-pointer transition-colors hover:bg-gray-50 border-l-4 ${impactColors[incident.impact]}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">{incident.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{incident.service.name}</span>
                <span>•</span>
                <span>{formatDistanceToNow(incident.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{incident.impact}</Badge>
              <Badge className={statusColors[incident.status]}>
                {incident.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        {incident.updates[0] && (
          <CardContent>
            <p className="text-sm text-gray-600">{incident.updates[0].message}</p>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}