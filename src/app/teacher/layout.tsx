import AppSidebar from "@/components/blocks/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Suspense } from "react";
import LoaderComponent from "../../components/blocks/LoaderComponent";
import "react-quill-new/dist/quill.snow.css";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex justify- items-center border-b">
          <SidebarTrigger className="m-4" />
          <div>
            <Image
              src="/static/app-logo-full.png"
              alt="Testkart Logo"
              width={900}
              height={150}
              className="md:hidden h-10 object-contain -ml-5"
            />
          </div>
        </div>
        <Suspense fallback={<LoaderComponent />}>{children}</Suspense>
      </main>
    </SidebarProvider>
  );
}
