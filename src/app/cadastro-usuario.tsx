import UserSignupScreen from '@/components/auth/user-signup-screen';
import AppShell from "@/components/layout/app-shell";

export default function UserSignupRoute() {
  return (
    <AppShell>
      <UserSignupScreen />
    </AppShell>
  );
}