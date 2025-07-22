import { NextResponse } from 'next/server';

// Helper function yang sudah kita buat sebelumnya
async function getPagesFromCategory(categoryName: string): Promise<any[]> {
    const url = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(categoryName)}&cmlimit=500&format=json&origin=*`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Fandom API Error for category "${categoryName}": Status ${response.status}`);
            return [];
        }
        const data = await response.json();
        // Disini kita bisa menambahkan logika pagination jika grup lebih dari 500
        return data.query.categorymembers;
    } catch (error: any) {
        console.error(`Network Error fetching category "${categoryName}":`, error.message);
        return [];
    }
}

export async function GET() {
    console.log("Fetching multiple categories from Fandom API...");

    try {
        // 1. Definisikan sub-kategori mana yang ingin Anda ambil datanya
        const targetCategories = [
            'Category:Male groups',
            'Category:Female groups',
            'Category:Co-ed groups' // Tambahkan kategori lain jika perlu
        ];

        // 2. Gunakan Promise.all untuk mengambil anggota dari semua kategori target secara paralel
        const resultsFromAllCategories = await Promise.all(
            targetCategories.map(category => getPagesFromCategory(category))
        );
        
        // 3. Gabungkan semua hasil menjadi satu array besar
        // `resultsFromAllCategories` akan menjadi array dari array, contoh: [ [boy groups], [female groups], ... ]
        // `.flat()` akan mengubahnya menjadi satu array saja: [ all groups... ]
        const allGroups = resultsFromAllCategories.flat();

        // 4. Kirim hasil akhir yang sudah digabung ke frontend
        return NextResponse.json(allGroups);

    } catch (error: any) {
        console.error('Error in GET handler:', error.message);
        return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
    }
}