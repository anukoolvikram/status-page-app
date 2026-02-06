import { Service } from "@prisma/client";
import { getStatusColor, getStatusLabel } from "@/lib/utils";

export function ServiceStatus({ service }: { service: Service }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-4">
      <div>
        <h3 className="font-medium">{service.name}</h3>
        {service.description && (
          <p className="text-sm text-gray-500">{service.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${getStatusColor(service.status)}`} />
        <span className="text-sm font-medium">{getStatusLabel(service.status)}</span>
      </div>
    </div>
  );
}