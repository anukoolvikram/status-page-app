import { Incident, Service, IncidentUpdate } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

type IncidentWithRelations = Incident & {
  service: Service;
  updates: IncidentUpdate[];
};

export function IncidentTimeline({ incidents }: { incidents: IncidentWithRelations[] }) {
  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <div key={incident.id} className="rounded-lg border bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{incident.title}</h4>
              <p className="text-sm text-gray-500">
                {incident.service.name} • {formatDistanceToNow(incident.createdAt, { addSuffix: true })}
              </p>
            </div>
            <span className={`rounded px-2 py-1 text-xs font-medium ${
              incident.status === "RESOLVED" ? "bg-green-100 text-green-800" : "bg-gray-100"
            }`}>
              {incident.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}