"use client";
import Link from "next/link";

const Header = () => {
    return (
        <div className="flex justify-around p-5 border-solid outline-white outline">
            <Link href={"/Image"}> Image Generation </Link>
            <Link href={"/"}> Chat </Link>
        </div>
    );
};

export default Header;
