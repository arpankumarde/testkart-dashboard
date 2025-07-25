"use client";

import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { setCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <form
      className="flex flex-col gap-6"
      action={async (e) => {
        const formData = Object.fromEntries(e.entries());

        const { data, error } = await login({
          email: formData["email"] as string,
          password: formData["password"] as string,
        });

        if (error || data?.error !== undefined) {
          toast.error(data?.error || "Login failed. Please try again.");
          return;
        } else if (data?.data && data?.data?.token) {
          setCookie("tkuser", data?.data, {
            maxAge: 30 * 24 * 60 * 60,
          });
          setCookie("tktoken", data?.data?.token, {
            maxAge: 30 * 24 * 60 * 60,
          });

          router.push("/teacher/dashboard");
        }
      }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            defaultValue={email ?? ""}
            id="email"
            name="email"
            type="email"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* <Link
              href="/auth/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link> */}
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          Login with Google (Coming Soon)
        </Button> */}
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
