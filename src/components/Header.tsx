import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const NAVIGATION_LINKS = [
	{ href: "#thi-sinh", label: "Thí Sinh" },
	{ href: "#dia-diem", label: "Địa Điểm" },
];

const Header = () => {
	return (
		<div className="h-20 flex items-center px-8 shadow-md fixed top-0 z-50 inset-x-0 bg-white">
			<Link className="flex items-center" href="/">
				<Image src="/images/logo-cuocthi-1.png" alt="ĐẤT VÕ TRỜI VĂN" width={80} height={80} />
				<h1 className="text-xl font-bold text-foreground">ĐẤT VÕ TRỜI VĂN</h1>
			</Link>
			<div className="flex gap-4 items-center ml-auto">
				{NAVIGATION_LINKS.map((link) => (
					<Link key={link.href} href={link.href} className="text-foreground hover:text-primary">
						{link.label}
					</Link>
				))}
				<Button size="lg" className="uppercase text-lg font-bold">
					Đặt vé ngay
				</Button>
			</div>
		</div>
	);
};
export default Header;
