export default function GroupDetailPage({ params }: { params: { slug: string } }) {
    return (
        <div className="py-18">
            <h1>{params.slug}</h1>
        </div>
    );
}