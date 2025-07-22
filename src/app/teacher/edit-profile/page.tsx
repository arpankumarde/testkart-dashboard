"use client";

import { getCookie } from "cookies-next/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthResponse } from "@/actions/auth";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import getTokenClient from "@/lib/getTokenClient";

const Page = () => {
  const [user, setUser] = useState<AuthResponse["data"] | null>(null);
  const token = getTokenClient();

  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateEmail = async () => {
    if (newEmail === "" || confirmEmail === "") {
      toast.error("New email cannot be empty!");
      return;
    }

    if (newEmail !== confirmEmail) {
      toast.error("New email and confirm email should be same!");
      return;
    }

    try {
      await api.post(
        `/api/v1/studio/teachers/email/${user?.user?.teacher_id}`,
        {
          id: user?.user?.teacher_id,
          email: user?.user?.email,
          new_email: newEmail,
          confirm_email: confirmEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_type: "TEACHER",
          },
        }
      );
      toast.success("Email updated successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update email");
    }
  };

  const updatePassword = async () => {
    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      toast.error("All fields are mandatory!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password should be same!");
      return;
    }
    try {
      await api.post(
        `/api/v1/studio/teachers/password/${user?.user?.teacher_id}`,
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_type: "TEACHER",
          },
        }
      );
      toast.success("Password updated successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    }
  };

  useEffect(() => {
    const userLocal = JSON.parse(
      getCookie("tkuser") as string
    ) as AuthResponse["data"];
    setUser(userLocal);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Email Update Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Update Email</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Current Email</label>
            <Input
              type="email"
              value={user?.user?.email || ""}
              disabled
              className="bg-gray-100"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">New Email</label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Confirm New Email
            </label>
            <Input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              required
            />
          </div>
          <Button onClick={updateEmail}>Update Email</Button>
        </div>

        {/* Password Update Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Update Password</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Old Password</label>
            <Input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button onClick={updatePassword}>Update Password</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
