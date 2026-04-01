import { getSubmissionsData } from "@/queries/photocards";
import ApproveClient from "./approveClient";

export default async function ApprovePage() {
    const approvementData = await getSubmissionsData()

    return (
        <ApproveClient 
            initialCards={approvementData}
        />
    )
}