"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SignupResponse } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";
import axios from "axios";

const VerificationForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const verifyTeacher = async (payload: { email: string; code: string }) => {
    try {
      const { data }: { data: SignupResponse } = await api.post(
        "/api/v1/studio/academy/verify-email",
        payload
      );

      if (data?.success === false) {
        toast.error("An error occurred. Please try again.");
        return;
      } else {
        toast.success(
          "Account created successfully. Please login to continue."
        );
        router.push(`/auth/login?email=${email}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error || "An error occurred. Please try again."
        );
      } else {
        toast.error("An error occurred. Please try again.");
        console.error(error);
      }
      return { error };
    }
  };

  return (
    <form
      className="flex flex-col gap-6"
      action={async (e) => {
        const formData = Object.fromEntries(e.entries()) as { code: string };

        await verifyTeacher({
          email: email,
          code: formData?.code as string,
        });
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
            maxLength={6}
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
