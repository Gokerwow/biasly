import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
    return (
        <nav className=" bg-white flex">
            <header>
                <Image
                src="/assets/images/biaslyLogo.png"
                alt="Biasly Logo"
                width={100}
                height={100}
                />
            </header>
            <ul className="text-black flex">
                <li>
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