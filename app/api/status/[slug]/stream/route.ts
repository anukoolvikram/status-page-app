import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial data
      const org = await prisma.organization.findUnique({
        where: { slug: params.slug },
        include: {
          services: true,
          incidents: {
            where: { status: { not: "RESOLVED" } },
            include: { service: true, updates: true },
          },
        },
      });

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(org)}\n\n`)
      );

      // Poll for updates every 5 seconds
      const interval = setInterval(async () => {
        const updated = await prisma.organization.findUnique({
          where: { slug: params.slug },
          include: {
            services: true,
            incidents: {
              where: { status: { not: "RESOLVED" } },
              include: { service: true, updates: true },
            },
          },
        });

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(updated)}\n\n`)
        );
      }, 5000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}