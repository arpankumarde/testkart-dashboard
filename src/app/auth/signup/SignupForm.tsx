"use client";

import { signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const router = useRouter();

  interface SignupPayload {
    academy_name: string;
    display_name: string;
    slug: string;
    contact_email: string;
    contact_phone: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
  }

  return (
    <form
      className="flex flex-col gap-6"
      action={async (e) => {
        const formData = Object.fromEntries(e.entries());

        formData["slug"] = (formData["academy_name"] as string)
          .trim()
          .toLowerCase()
          .split(" ")
          .join("-");

        const payload: SignupPayload = {
          first_name: formData["first_name"] as string,
          last_name: formData["last_name"] as string,
          email: formData["email"] as string,
          password: formData["password"] as string,
          confirm_password: formData["confirm_password"] as string,
          academy_name: (formData["academy_name"] as string).trim(),
          display_name: (formData["academy_name"] as string).trim(),
          slug: formData["slug"] as string,
          contact_email: formData["email"] as string,
          contact_phone: formData["contact_phone"] as string,
        };

        const { data } = await signup(payload);

        if (data?.success === false) {
          alert("An error occurred. Please try again.");
          return;
        } else {
          alert("Account created successfully. Please login to continue.");
          router.push("/auth/login");
        }
      }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Join as an Academy</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Create your account to get started.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="first_name">Your First Name</Label>
            <Input id="first_name" name="first_name" type="text" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last_name">Your Last Name</Label>
            <Input id="last_name" name="last_name" type="text" required />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contact_phone">Contact Phone</Label>
          <Input id="contact_phone" name="contact_phone" type="tel" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="academy_name">Academy Name</Label>
          <Input id="academy_name" name="academy_name" type="text" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="confirm_password">Confirm Password</Label>
          </div>
          <Input
            id="confirm_password"
            name="confirm_password"
            type="password"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Create Account
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
        Already have an account?{" "}
        <Link href="/auth/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
