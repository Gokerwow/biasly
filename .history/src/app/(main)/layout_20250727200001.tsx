import Navbar from '@/components/navbar'; // Contoh path ke navbar Anda

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        // Anda tidak perlu <html> dan <body> di sini lagi
        <main className='w-full'>
            <Navbar /> {/* Navbar ditampilkan di sini */}
            <div className='w-full'>
                {children}
            </div>
        </main>
    )
}