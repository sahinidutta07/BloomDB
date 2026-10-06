import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/bloom/AppShell";
import { PageError, PageLoading } from "@/components/bloom/ui";

export const Route = createFileRoute("/_shell")({
  component: () => <AppShell><Outlet /></AppShell>,
  pendingComponent: PageLoading,
  errorComponent: ({ error }) => <PageError error={error as Error} />,
});
