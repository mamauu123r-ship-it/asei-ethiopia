import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { PasswordForm } from "./PasswordForm";

export const metadata: Metadata = { title: "Change password" };

// Every staff member can change their own password here.
export default async function PasswordPage() {
  await requireStaff();
  return (
    <>
      <AdminHeader title="Change your password" />
      <PasswordForm />
    </>
  );
}
