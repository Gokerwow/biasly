import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="bg-white">
            <header>
                {/* <Image
                src="/assets/images/biaslyLogo.png"
                alt="Biasly Logo"
                width={200}
                height={100}
                /> */}
            </header>
            <ul>
                <li>
                    <Link href="#">Home</Link>
                </li>
            </ul>
        </nav>
    )
}