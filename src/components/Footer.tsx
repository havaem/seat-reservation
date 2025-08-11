import { Facebook, LocateIcon, Mail, Phone, Youtube } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="border-t bg-amber-950 px-4 py-4 text-sm text-white shadow">
      <div className="container mx-auto space-y-8">
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 [&_h3]:text-lg [&_h3]:uppercase">
          <div className="space-y-4">
            <h3>Đất võ trời văn</h3>
            <p>
              Cuộc thi &quot;Đất võ trời văn&quot; là một sự kiện văn hóa nghệ
              thuật đặc sắc, quy tụ nhiều tài năng trong lĩnh vực võ thuật và
              văn học.
            </p>
          </div>
          <div className="space-y-4">
            <h3>Đơn vị tổ chức</h3>
            <Image
              className="mx-auto block"
              src="/images/logo-team.png"
              alt="LEO Logo"
              width={100}
              height={100}
            />
            <p>Câu lạc bộ LEO</p>
          </div>
          <div className="space-y-4">
            <h3>Thông tin liên hệ</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-4">
                <Mail size={20} />
                contact@example.com.vn
              </li>
              <li className="flex gap-4">
                <Phone size={20} />
                0123 456 789
              </li>
              <li className="flex gap-4">
                <LocateIcon size={20} />
                123 Đường ABC, Quận 1, TP. HCM
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3>Kết nối</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-4">
                <Facebook size={20} />
                facebook.com/example
              </li>
              <li className="flex gap-4">
                <Youtube size={20} />
                youtube.com/example
              </li>
            </ul>
            <p className="text-sm">
              Theo dõi chúng tôi trên mạng xã hội để cập nhật những tin tức mới
              nhất!
            </p>
          </div>
        </div>

        <p className="text-center text-sm">
          © 2025 Bản quyền thuộc về BTC &quot;Đất Võ Trời Văn&quot;. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
