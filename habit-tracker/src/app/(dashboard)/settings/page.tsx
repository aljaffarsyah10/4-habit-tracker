import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, User, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account profile and application preferences.
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="size-4 text-primary" />
            <CardTitle className="text-base">Profile Information</CardTitle>
          </div>
          <CardDescription>Your personal credentials and display identity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="user@example.com" disabled />
          </div>
          <Button size="sm" variant="outline">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Security & Session */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <CardTitle className="text-base">Security & Session</CardTitle>
          </div>
          <CardDescription>Session management and account authentication.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between pt-2">
          <div>
            <p className="text-sm font-medium">Sign Out</p>
            <p className="text-xs text-muted-foreground">Terminate your current session on this device.</p>
          </div>
          <Button asChild variant="destructive" size="sm" className="gap-1.5">
            <Link href="/login">
              <LogOut className="size-4" />
              <span>Log Out</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

