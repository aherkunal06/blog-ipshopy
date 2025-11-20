// Server component - async allowed
import { getAdminSession } from "@/lib/getAdminSession";
import { hasAdminAccess } from "@/lib/hasAdminAccess";
import { redirect } from "next/navigation";
import DashboardContent from "@/admin-components/DashboardContent"; // client component

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!hasAdminAccess(session)) {
    redirect("/unauthorized");
  }

  return <DashboardContent />;
}

