import DashboardLayoutClient from "./layoutClient";
import { TopBarServer } from "@/components/topBar/topBarServer";
import { redirect } from "next/navigation";
import { getProfile } from "../lib/userServer";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getProfile()

    if (!session) {
        redirect('/login')
    }

    return (
        <DashboardLayoutClient topBar={<TopBarServer />}>
            {children}
        </DashboardLayoutClient>
    );
}