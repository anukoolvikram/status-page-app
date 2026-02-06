import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ incidentId: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const effectiveOrgId = orgId ?? userId;

    const { incidentId } = await params;

    const org = await prisma.organization.findUnique({
      where: { clerkOrgId: effectiveOrgId },
    });
    if (!org) return new NextResponse("Organization not found", { status: 404 });

    const incident = await prisma.incident.findFirst({
      where: { id: incidentId, organizationId: org.id },
      include: { service: true },
    });
    if (!incident) return new NextResponse("Incident not found", { status: 404 });

    const body = (await req.json()) as {
      title?: string;
      description?: string;
      status?: string;
      impact?: string;
      updateMessage?: string;
    };

    const nextStatus = typeof body.status === "string" ? body.status : undefined;
    const nextResolvedAt =
      nextStatus === "RESOLVED"
        ? incident.resolvedAt ?? new Date()
        : nextStatus
          ? null
          : undefined;

    const updated = await prisma.incident.update({
      where: { id: incident.id },
      data: {
        ...(typeof body.title === "string" ? { title: body.title } : {}),
        ...(typeof body.description === "string"
          ? { description: body.description }
          : {}),
        ...(typeof body.status === "string" ? { status: body.status } : {}),
        ...(typeof body.impact === "string" ? { impact: body.impact } : {}),
        ...(nextResolvedAt !== undefined ? { resolvedAt: nextResolvedAt } : {}),
      },
    });

    const updateMessage =
      typeof body.updateMessage === "string" ? body.updateMessage.trim() : "";

    if (updateMessage) {
      await prisma.incidentUpdate.create({
        data: {
          incidentId: incident.id,
          message: updateMessage,
          status: updated.status,
        },
      });
    }

    await pusherServer.trigger(`org-${org.slug}`, "incident-updated", {
      incident: updated,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/incidents");
    revalidatePath(`/dashboard/incidents/${incident.id}`);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[INCIDENT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

