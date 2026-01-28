"use client";

import { useState } from "react";
import BrandValueItem from "./brand-value-item";
import BrandValueModal from "./brand-value-modal";
import { BrandValueItem as BrandValueItemType } from "./types";

const brandValueData: BrandValueItemType[] = [
  {
    id: "1",
    title: "Thép Không Gỉ Cao Cấp",
    image: "/assets/placeholder-image.jpeg",
    shortContent:
      "Chế tác từ thép không gỉ cao cấp, kéo AKA giữ trọn độ sắc ngọt và sự bền bỉ cùng năm tháng",
    fullContent:
      "Tại AKA, chúng tôi tâm niệm rằng giá trị cốt lõi của một cây kéo gia dụng đẳng cấp luôn khởi nguồn từ chất liệu kiến tạo nên nó. Chính vì vậy, các sản phẩm của AKA đều được chế tác hoàn toàn từ dòng thép không gỉ cao cấp, trải qua quy trình xử lý nhiệt tiên tiến để tối ưu hóa độ cứng và khả năng chịu lực. Chất liệu thép thượng hạng giúp lưỡi kéo duy trì độ sắc bén vượt trội theo thời gian, đảm bảo những đường cắt luôn ngọt, dứt khoát, đồng thời loại bỏ hoàn toàn nỗi lo về gỉ sét hay ăn mòn trong môi trường nóng ẩm đặc thù của khí hậu Việt Nam.",
  },
  {
    id: "2",
    title: "An Toàn Sức Khỏe",
    image: "/assets/placeholder-image.jpeg",
    shortContent:
      "An tâm trong từng bữa ăn: Không độc tố, không chì. Được Quatest bảo chứng chất lượng vì sức khỏe người thân yêu",
    fullContent:
      "Tại AKA, sự an toàn của khách hàng là tôn chỉ hoạt động hàng đầu. Các sản phẩm của chúng tôi sử dụng chất liệu thép 'sạch', được kiểm soát nghiêm ngặt để loại bỏ hoàn toàn nguy cơ thôi nhiễm kim loại nặng (Pb, As). Với chất lượng đã được Tổng cục Tiêu chuẩn Đo lường Chất lượng (Quatest) kiểm định và chứng nhận, đạt chứng nhận ISO 9001:2015, kéo AKA là bảo chứng cho sự an tâm tuyệt đối, đáp ứng hoàn hảo nhu cầu chế biến thực phẩm an toàn cho trẻ nhỏ và cả gia đình.",
  },
  {
    id: "3",
    title: "Bảo Hành 5 Năm",
    image: "/assets/placeholder-image.jpeg",
    shortContent:
      "Bảo hành 5 năm chính hãng – Lời khẳng định đanh thép nhất cho chất lượng và vị thế của sản phẩm Việt",
    fullContent:
      "Chính sách bảo hành lên tới 5 năm không chỉ là một dịch vụ hậu mãi, mà là một lời tuyên ngôn đanh thép về độ bền của sản phẩm. Chúng tôi tự tin rằng, mỗi chiếc kéo AKA khi đến tay người tiêu dùng đều đã trải qua quy trình kiểm soát chất lượng nghiêm ngặt nhất, sẵn sàng đồng hành bền bỉ cùng năm tháng. Với niềm tự hào thương hiệu Việt Nam, chúng tôi khao khát thay đổi định kiến về hàng gia dụng trong nước, AKA là minh chứng sống động cho thấy sản phẩm Việt hoàn toàn có thể đạt tiêu chuẩn quốc tế về độ tinh xảo và tuổi thọ sử dụng.",
  },
  {
    id: "4",
    title: "Tự Hào Sản Xuất Tại Việt Nam",
    image: "/assets/placeholder-image.jpeg",
    shortContent:
      "Tự hào trí tuệ Việt: Thiết kế sinh ra từ sự thấu hiểu sâu sắc thói quen và văn hóa nấu nướng của gia đình Việt",
    fullContent:
      'Kết tinh từ tư duy và bàn tay người Việt AKA không chỉ đơn thuần là một sản phẩm "Made in Vietnam", mà là hiện thân của lòng tự hào dân tộc và khát vọng vươn tầm. Toàn bộ quy trình từ lên ý tưởng, thiết kế khuôn mẫu đến gia công hoàn thiện đều được thực hiện bởi đội ngũ kỹ Việt Nam lành nghề. Thấu hiểu trọn vẹn văn hóa bếp Việt, thói quen nấu nướng phong phú của người Việt, AKA đã tối ưu hóa thiết kế lưỡi kéo và lực cắt để đáp ứng hoàn hảo những nhu cầu thường ngày. Thiết kế được "đo ni đóng giày" cho người dùng Việt, sự thấu hiểu còn được thể hiện qua công thái học của sản phẩm. AKA tự hào mang đến một công cụ đắc lực, không chỉ sắc bén mà còn "hiểu" người dùng, giúp công việc nội trợ trở nên nhẹ nhàng và đầy cảm hứng.',
  },
];

export default function BrandValueSection() {
  const [selectedItem, setSelectedItem] = useState<BrandValueItemType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (item: BrandValueItemType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <section className="w-full py-8 md:py-12 lg:py-16">
      <h2 className="text-2xl lg:text-4xl font-bold mb-6 lg:mb-10 text-center">
        Giới thiệu về AKA
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {brandValueData.map((item) => (
          <BrandValueItem
            key={item.id}
            item={item}
            onReadMore={() => handleOpenModal(item)}
          />
        ))}
      </div>

      <BrandValueModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
