import { AdminPanelClient } from "@/components/admin/AdminPanelClient";

export default function AdminPage() {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  return <AdminPanelClient adminPassword={adminPassword} />;
}
