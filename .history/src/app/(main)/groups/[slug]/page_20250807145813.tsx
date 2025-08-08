export default function GroupDetailPage({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>{group.name}</h1>
            <p>Company: {group.company}</p>
            {/* Tampilkan info detail grup lainnya di sini */}
        </div>
    );
}