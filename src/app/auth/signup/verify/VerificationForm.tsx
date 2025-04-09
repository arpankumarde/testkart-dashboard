"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { verifyTeacher } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const VerificationForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  return (
    <form
      className="flex flex-col gap-6"
      action={async (e) => {
        const formData = Object.fromEntries(e.entries());

        const { data } = await verifyTeacher({
          email: email,
          code: formData["code"] as string,
        });

        if (data?.success === false) {
          alert("An error occurred. Please try again.");
          return;
        } else {
          alert("Account created successfully. Please login to continue.");
          router.push(`/auth/login?email=${email}`);
        }
      }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-bold">Verify Email</h2>
        <p>
          Please check your email {email} for the verification link. If you do
          not see the email, please check your spam folder.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="code">Verification Code</Label>
          </div>
          <Input
            id="code"
            name="code"
            type="text"
            required
            minLength={6}
            // maxLength={6}
          />
        </div>

        <Button type="submit" className="w-full">
          Verify and Sign Up
        </Button>
      </div>
    </form>
  );
};

export default VerificationForm;
