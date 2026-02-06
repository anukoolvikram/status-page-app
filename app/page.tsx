import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Bell, BarChart3, Zap } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <div className="h-8 w-8 rounded bg-primary" />
            <span>StatusPage</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                Keep Your Users Informed
              </h1>
              <p className="text-xl text-gray-600">
                A modern status page to communicate service health and incidents to your users in real-time.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <SignedOut>
                <Link href="/sign-up">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
              </SignedIn>
            </div>

            {/* Demo Status Page Link */}
            <p className="text-sm text-gray-500">
              Want to see it in action?{" "}
              <Link href="/status/demo" className="text-primary hover:underline">
                View demo status page
              </Link>
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t bg-gray-50 py-24">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold">Everything You Need</h2>
              <p className="mt-4 text-gray-600">
                Powerful features to keep your users in the loop
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<CheckCircle className="h-6 w-6" />}
                title="Service Monitoring"
                description="Track the status of all your services in one place"
              />
              <FeatureCard
                icon={<Bell className="h-6 w-6" />}
                title="Incident Management"
                description="Create and manage incidents with real-time updates"
              />
              <FeatureCard
                icon={<Zap className="h-6 w-6" />}
                title="Real-time Updates"
                description="Push status changes instantly to all connected clients"
              />
              <FeatureCard
                icon={<BarChart3 className="h-6 w-6" />}
                title="Public Status Pages"
                description="Beautiful status pages your customers will love"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-2xl space-y-8">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600">
              Create your status page in minutes and start keeping your users informed.
            </p>
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg">Create Your Status Page</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            </SignedIn>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2024 StatusPage. Built with Next.js, Prisma, and Clerk.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2 rounded-lg border bg-white p-6">
      <div className="inline-flex rounded-lg bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}