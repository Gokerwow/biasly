import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    const { data: groups } = await supabase
        .from("groups")
        .select("id, name")
        .limit(1);

    if (!groups || groups.length === 0) {
        return NextResponse.json(
            { error: "No groups found! Please seed groups first." },
            { status: 400 }
        );
    }

    const targetGroup = groups[0];
    console.log(`Creating items for group: ${targetGroup.name}`);

    const dummyItems = [
        {
            name: `${targetGroup.name} Official Light Stick Ver. 2`,
            link: "https://amazon.com/placeholder-link",
            image_url: "https://via.placeholder.com/300?text=Lightstick",
            price: "$59.99",
            category: "lightstick",
            group_id: targetGroup.id,
        },
        {
            name: `The 1st Album: 'Get Up'`,
            link: "https://amazon.com/placeholder-link-2",
            image_url: "https://via.placeholder.com/300?text=Album",
            price: "$24.50",
            category: "album",
            group_id: targetGroup.id,
        },
        {
            name: `${targetGroup.name} World Tour Hoodie`,
            link: "https://amazon.com/placeholder-link-3",
            image_url: "https://via.placeholder.com/300?text=Hoodie",
            price: "$85.00",
            category: "apparel",
            group_id: targetGroup.id,
        },
    ];

    const { data, error } = await supabase
        .from("affiliate_items")
        .insert(dummyItems)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        message: `Added ${dummyItems.length} items for ${targetGroup.name}`,
        data
    });
}