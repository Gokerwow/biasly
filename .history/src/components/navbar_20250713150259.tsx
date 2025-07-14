import Image from "next/image"

export default function Navbar() {
    return (
        <nav>
            <header>
                <Image
                src="/assets/images/biaslyLogo.png"
                alt="Biasly Logo"
                fill
                />
            </header>
        </nav>
    )
}