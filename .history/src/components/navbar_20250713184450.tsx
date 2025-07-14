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
                <li className=" p-2 flex justify-center items-center">
                    <Link href="#" className="flex justify-center items-center">
                        <Image
                        src="/home.svg"
                        alt="Home Icon"
                        width={0}
                        height={30}
                        />
                        Home
                    </Link>
                </li>
                <li className=" p-2 flex justify-center items-center">
                    <Link href="#">Groups</Link>
                </li>
                <li className=" p-2 flex justify-center items-center">
                    <Link href="#">Idols</Link>
                </li>
                <li className=" p-2 flex justify-center items-center">
                    <Link href="#">Discovery</Link>
                </li>
                <li className=" p-2 flex justify-center items-center">
                    <Link href="#">Community</Link>
                </li>
            </ul>
            <div>
                <button>
                    Sign In
                </button>
                <button>
                    Join
                </button>
            </div>
        </nav>
    )
}