import { Facebook, Instagram, LocateIcon, Mail, Phone } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="border-t bg-amber-950 px-4 py-4 text-sm text-white shadow">
      <div className="container mx-auto space-y-8">
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 [&_h3]:text-lg [&_h3]:uppercase">
          <div className="space-y-4">
            <h3>ĐẤT VÕ TRỜI VĂN MÙA 3</h3>
            <p className="leading-6">
              &quot;Đất võ trời văn&quot; là cuộc thi học thuật thường niên do
              CLB Olympia Chuyên Lê Quý Đôn Gia Lai (LEO) tổ chức nhằm tìm kiếm
              thí sinh đại diện trường THPT Chuyên Lê Quý Đôn Gia Lai chinh
              chiến tại đấu trường &quot;Đường lên đỉnh Olympia&quot;.
              <br />
              Với hình tượng chủ đạo là ánh đèn đom đóm của nhà thơ Cao Bá Quát,
              &quot;Đất Võ Trời Văn&quot; mùa 3 mang đến thông điệp &quot;Ánh
              lửa nhỏ cũng có thể soi nguồn tri thức lớn&quot;, hứa hẹn đem lại
              cho khán giả nhiều trận đấu gay cấn và những màn tranh tài hấp
              dẫn.
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
            <p>CLB Olympia Chuyên Lê Quý Đôn Gia Lai (LEO)</p>
          </div>
          <div className="space-y-4">
            <h3>Thông tin liên hệ</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="mailto:olympiachuyenlqdbd@gmail.com"
                  className="flex gap-4"
                >
                  <Mail size={20} />
                  olympiachuyenlqdbd@gmail.com
                </a>
              </li>
              <li className="flex gap-4">
                <a href="tel:0352515787" className="flex gap-4">
                  <Phone size={20} />
                  0352 515 787 (Trưởng BTC: Trần Giáp Phương Linh)
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/DdPqXCKiJF1riNCX8"
                  className="flex gap-4"
                  target="_blank"
                >
                  <LocateIcon size={20} />
                  02 Nguyễn Huệ, phường Quy Nhơn, tỉnh Gia Lai
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3>Kết nối</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=100091634093561"
                  className="flex gap-4"
                  target="_blank"
                >
                  <Facebook size={20} />
                  facebook.com/LEOchuyenlqdb
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/don.leo.famiglia"
                  className="flex gap-4"
                  target="_blank"
                >
                  <Instagram size={20} />
                  instagram.com/LEOchuyenlqdb
                </a>
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
