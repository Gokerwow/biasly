import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
    return (
        <nav className=" bg-red-500 flex justify-between items-center">
            <header>
                <Image
                src="/assets/images/biaslyLogo.png"
                alt="Biasly Logo"
                width={80}
                height={80}
                />
            </header>
            <ul className="text-black flex bg-amber-400 h-full px-5">
                <li className="bg-orange-100 py-10 flex justify-center items-center">
                    <Link href="#">Home</Link>
                </li>
                <li>
                    <Link href="#">Groups</Link>
                </li>
                <li>
                    <Link href="#">Idols</Link>
                </li>
                <li>
                    <Link href="#">Discovery</Link>
                </li>
                <li>
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