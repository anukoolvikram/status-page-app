import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // IMPORTANT: unwrap params in Next.js 16
  const { slug } = await params;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      async function sendData() {
        const org = await prisma.organization.findUnique({
          where: { slug },
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
      }

      // Initial push
      await sendData();

      // Poll every 5s
      const interval = setInterval(sendData, 5000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
