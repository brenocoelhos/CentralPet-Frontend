import DashboardScreen from "@/components/dashboard/dashboard-screen";
import AppShell from "@/components/layout/app-shell";

export default function DashboardRoute() {
  return (
    <AppShell>
      <DashboardScreen />
    </AppShell>
  );
}
