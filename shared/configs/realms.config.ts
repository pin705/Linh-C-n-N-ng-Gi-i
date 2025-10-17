export interface Realm {
  id: number
  name: string
  expRequired: number // Tổng tu vi cần để đạt cảnh giới này
  description: string
}

export const REALMS: Realm[] = [
  { id: 1, name: 'Phàm Nhân', expRequired: 0, description: 'Thân thể trần tục, chưa bước vào con đường tu luyện.' },
  { id: 2, name: 'Nhập Thú Cảnh', expRequired: 1000, description: 'Bắt đầu cảm nhận được sự liên kết với sinh linh, có thể thuần hóa thú thường.' },
  { id: 3, name: 'Dưỡng Thú Cảnh', expRequired: 5000, description: 'Khí tức có thể nuôi dưỡng linh thú, giúp chúng tăng trưởng.' },
  { id: 4, name: 'Ngự Thú Cảnh', expRequired: 25000, description: 'Tâm ý tương thông, có thể ra lệnh cho linh thú chiến đấu.' }
  // Thêm các cảnh giới cao hơn...
].sort((a, b) => a.expRequired - b.expRequired) // Sắp xếp để dễ dàng xử lý logic
