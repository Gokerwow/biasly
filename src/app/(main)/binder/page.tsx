import { getProfile } from "@/app/lib/userServer"
import BinderClient from "./binderClient"
import { getUserBinders } from "@/queries/binders"

export default async function BinderPage() {
    const profile = (await getProfile())!
    
    const bindersData = await getUserBinders(profile.id)

    return (
        <BinderClient 
        bindersData={bindersData}
        />
    )
}