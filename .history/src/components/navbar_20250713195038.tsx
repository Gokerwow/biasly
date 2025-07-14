import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
    return (
        <nav className=" bg-white flex justify-between items-center">
            <header>
                <Image
                src="/assets/images/biaslyLogo.png"
                alt="Biasly Logo"
                width={80}
                height={80}
                />
            </header>
            <ul className="text-black bg-[#F9F9F9] flex h-full px-5 rounded-2xl border-1 border-gray-400">
                <li className="p-2 flex justify-center items-center ">
                    <Link href="#" className="flex justify-center items-end gap-1">
                        <Image
                        src="/home.svg"
                        alt="Home Icon"
                        width={25}
                        height={25}
                        />
                        <span>Home</span>
                    </Link>
                </li>
                <li className="p-2 flex justify-center items-center ">
                    <Link href="#" className="flex justify-center items-end gap-1">
                        <Image
                        src="/groups.svg"
                        alt="Home Icon"
                        width={25}
                        height={25}
                        />
                        <span>Groups</span>
                    </Link>
                </li>
                <li className="p-2 flex justify-center items-center ">
                    <Link href="#" className="flex justify-center items-end gap-1">
                        <Image
                        src="/idols.svg"
                        alt="Home Icon"
                        width={25}
                        height={25}
                        />
                        <span>Idols</span>
                    </Link>
                </li>
                <li className="p-2 flex justify-center items-center ">
                    <Link href="#" className="flex justify-center items-end gap-1">
                        <Image
                        src="/discovery.svg"
                        alt="Home Icon"
                        width={25}
                        height={25}
                        />
                        <span>Discovery</span>
                    </Link>
                </li>
                <li className="p-2 flex justify-center items-center ">
                    <Link href="#" className="flex justify-center items-end gap-1">
                        <Image
                        src="/community.svg"
                        alt="Home Icon"
                        width={25}
                        height={25}
                        />
                        <span>Community</span>
                    </Link>
                </li>
            </ul>
            <div>
                <button className="px-5 py-2 rounded-2xl border-1 border-gray-400">
                    Sign In
                </button>
                <button>
                    Join
                </button>
            </div>
        </nav>
    )
}