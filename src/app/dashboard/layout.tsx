import Sidebar from "@/components/Sidebar";
import KPIHeader from "@/components/KPIHeader";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[#101922] font-display text-white overflow-hidden h-screen flex">
            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <KPIHeader />
                {children}
            </div>
        </div>
    );
}
