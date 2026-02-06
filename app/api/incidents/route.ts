import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const effectiveOrgId = orgId ?? userId;

    const org = await prisma.organization.findUnique({
      where: { clerkOrgId: effectiveOrgId },
    });

    if (!org) return new NextResponse("Organization not found", { status: 404 });

    const body = await req.json();
    const { title, description, serviceId, status, impact } = body;

    const incident = await prisma.incident.create({
      data: {
        title,
        description,
        serviceId,
        status: status || "INVESTIGATING",
        impact: impact || "MINOR",
        organizationId: org.id,
      },
      include: {
        service: true,
      },
    });

    await prisma.incidentUpdate.create({
      data: {
        incidentId: incident.id,
        message: description,
        status: incident.status,
      },
    });

    await prisma.service.update({
      where: { id: serviceId },
      data: {
        status: impact === "CRITICAL" ? "MAJOR_OUTAGE" : 
                impact === "MAJOR" ? "PARTIAL_OUTAGE" : "DEGRADED",
      },
    });

    // Trigger real-time update
    await pusherServer.trigger(`org-${org.slug}`, "incident-created", {
      incident,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/incidents");

    return NextResponse.json(incident);
  } catch (error) {
    console.error("[INCIDENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}