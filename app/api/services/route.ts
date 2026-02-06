import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const effectiveOrgId = orgId ?? userId;


    const org = await prisma.organization.findUnique({
      where: { clerkOrgId: effectiveOrgId },
    });

    if (!org) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    const services = await prisma.service.findMany({
      where: { organizationId: org.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("[SERVICES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const effectiveOrgId = orgId ?? userId;

    const org = await prisma.organization.findUnique({
      where: { clerkOrgId: effectiveOrgId },
    });

    if (!org) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    const body = await req.json();
    const { name, description, status } = body;

    const service = await prisma.service.create({
      data: {
        name,
        description,
        status: status || "OPERATIONAL",
        organizationId: org.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/services");

    return NextResponse.json(service);
  } catch (error) {
    console.error("[SERVICES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}