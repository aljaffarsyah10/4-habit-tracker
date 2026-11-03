import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Start tracking your habits and reaching your goals today.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" type="text" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" />
          <p className="text-[11px] text-muted-foreground">
            Must be at least 8 characters long.
          </p>
        </div>
        <Button className="w-full" asChild>
          <Link href="/dashboard">Create Account</Link>
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border pt-4 text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="ml-1 font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}

