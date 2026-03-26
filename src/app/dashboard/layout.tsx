import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import KPIHeader from "@/components/KPIHeader";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="font-display text-white overflow-hidden h-screen flex">
            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative pb-14 md:pb-0">
                <KPIHeader />
                {children}
            </div>

            <MobileNav />
        </div>
    );
}
