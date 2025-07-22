export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Layout ini hanya merender children tanpa elemen tambahan seperti navbar
    return <>{children}</>
}