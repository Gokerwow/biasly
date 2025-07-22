import Navbar from '@/components/Navbar'; // Contoh path ke navbar Anda

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Anda tidak perlu <html> dan <body> di sini lagi
    <main>
      <Navbar /> {/* Navbar ditampilkan di sini */}
      {children}
    </main>
  )
}