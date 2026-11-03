import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Flame, TrendingUp, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
          <Flame className="size-3.5 fill-current" />
          <span>Simple habit tracking with meaningful progress</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground sm:leading-tight">
          Build lasting positive habits,{" "}
          <span className="text-primary">one day at a time.</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Membantu Anda memantau konsistensi, mempertahankan motivasi jangka panjang, dan melihat perkembangan nyata tanpa distraksi.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto gap-2">
            <Link href="/register">
              <span>Start Tracking Free</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/dashboard">View Demo Dashboard</Link>
          </Button>
        </div>

        {/* Value Prop Cards */}
        <div className="mt-16 sm:mt-24 grid sm:grid-cols-3 gap-6 text-left">
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="size-5" />
              </div>
              <h3 className="font-semibold text-base">One-Click Tracking</h3>
              <p className="text-xs text-muted-foreground">
                Tandai habit selesai dalam sekejap dengan antarmuka yang cepat dan responsif.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="size-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Flame className="size-5" />
              </div>
              <h3 className="font-semibold text-base">Smart Streaks</h3>
              <p className="text-xs text-muted-foreground">
                Perhitungan streak yang adil dan konsisten sesuai hari jadwal habit Anda.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="size-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <TrendingUp className="size-5" />
              </div>
              <h3 className="font-semibold text-base">Progress & Analytics</h3>
              <p className="text-xs text-muted-foreground">
                Pantau completion rate mingguan dan bulanan berdasarkan data aktual.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
