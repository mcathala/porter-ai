import ActionDock from "@/components/ActionDock";
import DashboardFeed from "@/components/DashboardFeed";

export default function DashboardPage() {
    return (
        <main className="flex flex-1 flex-col overflow-hidden relative">
            {/* Feed Section (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
                <div className="mx-auto max-w-3xl flex flex-col gap-6 pb-32">
                    <DashboardFeed />
                </div>
            </div>

            {/* Action Dock (Bottom Fixed) */}
            <ActionDock />
        </main>
    );
}
