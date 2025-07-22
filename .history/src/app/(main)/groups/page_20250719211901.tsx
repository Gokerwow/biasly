'use client'

import { useEffect, useState } from "react"

// Definisikan tipe data untuk group agar lebih aman
interface Group {
    name: string;
    picture: string;
}

export default function GroupsPage() {
    // State untuk menyimpan data yang sudah terstruktur
    const [boyGroups, setBoyGroups] = useState<Group[]>([]);
    const [girlGroups, setGirlGroups] = useState<Group[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch('/api/groups'); // Panggil endpoint Anda

                if (!response.ok) {
                    // Buat pesan error yang lebih informatif
                    throw new Error(`Error: Gagal mengambil data dari server (Status: ${response.status})`);
                }

                const result = await response.json();

                // ✅ Perbaikan 1: Simpan data sesuai strukturnya
                setBoyGroups(result.boyGroups || []);
                setGirlGroups(result.girlGroups || []);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchGroups();
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            {/* ✅ Perbaikan 2: Tampilkan data dengan mapping */}
            <h1>Boy Groups</h1>
            <ul>
                {boyGroups.map((group, index) => <li key={index}>{group.name}</li>)}
            </ul>

            <h1>Girl Groups</h1>
            <ul>
                {girlGroups.map((group, index) => <li key={index}>{group.name}</li>)}
            </ul>
        </div>
    )
}