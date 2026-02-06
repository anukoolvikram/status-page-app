import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ServiceForm } from "@/components/dashboard/service-form";

export default async function NewServicePage() {
  const { userId, orgId } = await auth();

  // Require authentication
  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard/services/new");
  }

  // Fallback workspace (supports personal users)
  // (kept here in case you later need it for org-scoped logic)
  void (orgId ?? userId);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Service</h1>
        <p className="text-gray-500">Add a new service to monitor</p>
      </div>

      <ServiceForm />
    </div>
  );
}