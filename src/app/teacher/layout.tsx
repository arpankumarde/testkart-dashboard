import AppSidebar from "@/components/blocks/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";
import LoaderComponent from "../../components/blocks/LoaderComponent";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Suspense fallback={<LoaderComponent />}>{children}</Suspense>
      </main>
    </SidebarProvider>
  );
}
