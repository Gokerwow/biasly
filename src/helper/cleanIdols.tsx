import { PhotocardIdolsPivot, SimpleIdol } from "@/types"

export const cleanIdols = (photocards_idol: PhotocardIdolsPivot[]) => {
    const idols = photocards_idol
        .map(pi => pi.idol)
        .filter((i) => i !== null) as SimpleIdol[]

    return idols
}