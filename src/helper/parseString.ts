export function CapitalizeFirstletter(str: string) {
    const firstLetter = str.charAt(0).toUpperCase()
    const rest = str.slice(1)
    const complete = firstLetter + rest

    return complete
}