export default function GroupsPage() {
    const [groups, setGroups] = useState<groups[]>([])
    const [message, setMessage] = useState('');

    console.log(groups)

    return (
        <div>
            {groups.map((group, index) => {
                return <h1 key={index}>{group.title}</h1>
            })}
        </div>
    )
}