"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";
import { Service, Incident, IncidentUpdate } from "@prisma/client";
import { ServiceStatus } from "./service-status";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

type IncidentWithRelations = Incident & {
  service: Service;
  updates: IncidentUpdate[];
};

type Props = {
  initialServices: Service[];
  initialIncidents: IncidentWithRelations[];
  orgSlug: string;
};

export function RealTimeStatus({ initialServices, initialIncidents, orgSlug }: Props) {
  const [services, setServices] = useState(initialServices);
  const [incidents, setIncidents] = useState(initialIncidents);


  useEffect(() => {
    const channel = pusherClient.subscribe(`org-${orgSlug}`);

    channel.bind("incident-created", (data: { incident: IncidentWithRelations }) => {
      setIncidents((prev) => [data.incident, ...prev]);
    });

    channel.bind("incident-updated", (data: { incident: IncidentWithRelations }) => {
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === data.incident.id ? data.incident : inc))
      );
    });

    channel.bind("service-updated", (data: { service: Service }) => {
      setServices((prev) =>
        prev.map((svc) => (svc.id === data.service.id ? data.service : svc))
      );
    });

    return () => {
      pusherClient.unsubscribe(`org-${orgSlug}`);
    };
  }, [orgSlug]);

  const allOperational = services.every((s) => s.status === "OPERATIONAL");

  return (
    <>
      {/* Status Header */}
      <div className="mb-8">
        <div className="mt-4 flex items-center gap-2">
          {allOperational ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-lg font-medium text-green-600">
                All Systems Operational
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span className="text-lg font-medium text-orange-600">
                Some Systems Experiencing Issues
              </span>
            </>
          )}
        </div>
      </div>

      {/* Active Incidents */}
      {incidents.filter((i) => i.status !== "RESOLVED").length > 0 && (
        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold">Active Incidents</h2>
          {incidents
            .filter((i) => i.status !== "RESOLVED")
            .map((incident) => (
              <div key={incident.id} className="rounded-lg border bg-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{incident.title}</h3>
                    <p className="text-sm text-gray-500">{incident.service.name}</p>
                  </div>
                  <Badge>{incident.status}</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  {(incident.updates ?? []).map((update) => (
                    <div key={update.id} className="text-sm">
                      <p className="text-gray-600">{update.message}</p>
                      <p className="text-xs text-gray-400">
                        <span suppressHydrationWarning>
                          {new Date(update.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Services */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Services</h2>
        <div className="space-y-2">
          {services.map((service) => (
            <ServiceStatus key={service.id} service={service} />
          ))}
        </div>
      </div>
    </>
  );
}