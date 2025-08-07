"use client";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const NAVIGATION_LINKS = [
  { href: "#thi-sinh", label: "Thí Sinh" },
  { href: "#dia-diem", label: "Địa Điểm" },
];

const Header = () => {
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpenMobileMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="sticky inset-x-0 top-0 z-50 flex h-20 items-center bg-white px-8 shadow-md">
      <Link className="flex items-center" href="/">
        <Image
          src="/images/logo-cuocthi-1.png"
          alt="ĐẤT VÕ TRỜI VĂN"
          width={80}
          height={80}
        />
        <h1 className="text-foreground text-xl font-bold">ĐẤT VÕ TRỜI VĂN</h1>
      </Link>

      {/* Mobile menu button */}
      {isOpenMobileMenu && (
        <div className="absolute top-20 right-0 left-0 bg-white p-4 shadow-lg">
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary mb-2 block"
            >
              {link.label}
            </Link>
          ))}
          <Button size="lg" className="w-full text-lg font-bold uppercase">
            Đặt vé ngay
          </Button>
        </div>
      )}

      <div className="ml-auto">
        <Button
          variant="ghost"
          className="ml-4 md:hidden"
          size="icon"
          onClick={() => setIsOpenMobileMenu(!isOpenMobileMenu)}
        >
          <Menu size={24} />
        </Button>
        <div className="hidden items-center gap-4 min-md:flex">
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Button size="lg" className="text-lg font-bold uppercase">
            Đặt vé ngay
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Header;
