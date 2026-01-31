import DashboardLayoutClient from "./layoutClient";
import { TopBarServer } from "@/components/topBar/topBarServer";

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayoutClient topBar={<TopBarServer />}>
            {children}
        </DashboardLayoutClient>
    );
}