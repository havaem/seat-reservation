import { Check, CircleQuestionMark, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import PageTitle from "./ui/title";

const AudienceBenefits = () => {
  return (
    <section id="info">
      <div className="container mx-auto flex min-h-[800px] flex-col justify-center gap-8 px-4 py-10">
        <PageTitle className="text-center">Thông tin</PageTitle>
        <div className="container mx-auto px-4">
          <Card className="mb-8 gap-4 text-center font-semibold">
            <CardContent>
              <ul>
                <li>
                  100 khán giả mua vé đầu tiên sẽ được tặng 1 voucher giảm giá
                  30% khi mua máy tính cầm tay VINACAL.
                </li>
                <li>
                  10 khán giả mua vé đầu tiên sẽ được tặng 1 voucher chụp
                  photobooth trị giá 70.000 VNĐ tại Coco. Booth - Quy Nhơn
                  Concept.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Ticket Benefits */}
          <div className="mx-auto mb-12 grid max-w-3xl gap-8 md:grid-cols-2">
            <Card className="gap-4">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <span className="bg-primary mr-3 h-3 w-3 rounded-full"></span>
                  Vé VIP - 40,000 VNĐ
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-4">
                    <Check className="text-green-500" />
                    <div>
                      <span>Hamburger - Chọn 1</span>
                      <ul>
                        <li>- Bò + phô mai</li>
                        <li>- Gà + phô mai</li>
                        <li>- Tôm + phô mai</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="text-green-500" />
                    <span>1 Panna Cotta</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="text-green-500" />
                    <div>
                      <span>1 Nước Uống - Chọn 1</span>
                      <ul>
                        <li>- Soda Thanh Yên</li>
                        <li>- Soda Quả Mọng</li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="gap-4">
              <CardHeader>
                <CardTitle className="text-secondary-foreground flex items-center">
                  <span className="bg-secondary-foreground mr-3 h-3 w-3 rounded-full"></span>
                  Vé Thường - 35,000 VNĐ
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-4">
                    <Check className="text-green-500" />
                    <span>1 Mì Ý</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="text-green-500" />
                    <div>
                      <span>1 Nước Uống - Chọn 1</span>
                      <ul>
                        <li>- Soda Thanh Yên</li>
                        <li>- Soda Quả Mọng</li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Minigames */}
          <div className="mb-12">
            <h3 className="mb-8 text-center text-3xl font-bold text-white">
              Các Hoạt Động Thú Vị
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="pb-3 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#f88134] to-[#821b2f]">
                    <span className="text-2xl text-white">
                      <Palette />
                    </span>
                  </div>
                  <CardTitle className="text-xl">
                    Dự đoán số điểm nhà vô địch
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Khán giả sẽ viết số điểm dự đoán cho nhà vô địch “Đất Võ
                    Trời Văn” mùa 3 vào một tờ phiếu có mã số ghế riêng. Sau
                    trận đấu, 8 khán giả có con số dự đoán gần nhất với số điểm
                    của nhà vô địch sẽ được tặng 1 voucher photobooth trị giá
                    70.000 VNĐ tại Coco.Booth - Quy Nhơn Concept.
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="pb-3 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#f88134] to-[#821b2f]">
                    <span className="text-2xl text-white">
                      <CircleQuestionMark />
                    </span>
                  </div>
                  <CardTitle className="text-xl">Trả lời câu hỏi</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Các cố vấn của cuộc thi sẽ lần lượt đưa ra các câu hỏi kiến
                    thức thú vị, khán giả trả lời đúng sẽ nhận được 1 chiếc vòng
                    tay được thiết kế riêng theo chủ đề của cuộc thi.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudienceBenefits;
