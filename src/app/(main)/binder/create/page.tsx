import CreateBinderClient from "./createClient";
import { getAllTemplates } from "@/queries/templates";

export default async function CreateBinderpage() {
    const templatesData = await getAllTemplates()
    console.log(templatesData)
    return <CreateBinderClient 
        templatesData={templatesData}
    />
}