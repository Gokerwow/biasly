import Navbar from '@/components/navbar'; // Contoh path ke navbar Anda

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        // Anda tidak perlu <html> dan <body> di sini lagi
        <main className="pt-20 px-40">
            <Navbar /> {/* Navbar ditampilkan di sini */}
            {children}
        </main>
    )
}