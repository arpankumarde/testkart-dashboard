import AppSidebar from "@/components/blocks/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Suspense } from "react";
import LoaderComponent from "../../components/blocks/LoaderComponent";
import "react-quill-new/dist/quill.snow.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="border-b p-4">
          <SidebarTrigger />
        </div>
        <Suspense fallback={<LoaderComponent />}>{children}</Suspense>
      </main>
    </SidebarProvider>
  );
}
