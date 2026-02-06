import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const effectiveOrgId = orgId ?? userId;
    const { serviceId } = await params;

    const org = await prisma.organization.findUnique({
      where: { clerkOrgId: effectiveOrgId },
    });
    if (!org) return new NextResponse("Organization not found", { status: 404 });

    const service = await prisma.service.findFirst({
      where: { id: serviceId, organizationId: org.id },
    });
    if (!service) return new NextResponse("Service not found", { status: 404 });

    const body = await req.json();
    const { name, description, status } = body as {
      name?: string;
      description?: string | null;
      status?: string;
    };

    const updated = await prisma.service.update({
      where: { id: service.id },
      data: {
        ...(typeof name === "string" ? { name } : {}),
        ...(description === null || typeof description === "string"
          ? { description }
          : {}),
        ...(typeof status === "string" ? { status } : {}),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/services");

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[SERVICE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

