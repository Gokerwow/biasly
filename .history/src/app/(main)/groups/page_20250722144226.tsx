'use client'

import { useEffect, useState } from "react"

interface groups {
    pageid: number,
    ns: number,
    title: string
}

export default function GroupsPage() {
    const [groups, setGroups] = useState<groups[]>([])
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            const response = await fetch('api/groups/boy')

            if (!response.ok) {
                throw new Error(`HTTP errorrrr! Status: ${response.status}`);
            }

            const result = await response.json()

            // ✅ PERBAIKAN UTAMA: Periksa tipe data yang diterima
            if (Array.isArray(result)) {
                // Jika hasilnya adalah array, simpan ke state groups
                setGroups(result);
                setMessage(`Successfully fetched ${result.length} groups.`);
            } else if (result.message) {
                // Jika hasilnya adalah objek pesan, simpan pesannya
                setMessage(result.message);
                setGroups([]); // Pastikan groups tetap array kosong
            }
        }

        fetchGroups()
    }, [])

    console.log(groups)

    return (
        <div>
            {groups.map((group, index) => {
                return <h1 key={index}>{group.title}</h1>
            })}
        </div>
    )
}