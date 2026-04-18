import DashboardScreen from "@/components/dashboard/dashboard-screen";
import AppShell from "@/components/layout/app-shell";

export default function HomeScreen() {
  return (
    <AppShell>
      <DashboardScreen />
    </AppShell>
  );
}
