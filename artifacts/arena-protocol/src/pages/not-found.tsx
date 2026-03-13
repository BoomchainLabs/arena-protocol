import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center bg-background">
      <div className="max-w-md text-center border-2 border-destructive p-8 clip-edges relative overflow-hidden">
        <div className="absolute inset-0 bg-destructive/10 scanlines" />
        <div className="relative z-10">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
          <h1 className="text-4xl font-black font-display text-destructive mb-2 glitch-text">404</h1>
          <h2 className="text-xl font-bold font-mono text-white mb-6 uppercase tracking-widest">Sector Not Found</h2>
          <p className="text-muted-foreground font-mono text-sm mb-8">
            The neural pathway you requested does not exist in the current protocol directory.
          </p>
          <Link href="/">
            <Button variant="destructive" className="w-full">
              RETURN TO NEXUS
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
