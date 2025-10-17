// Định nghĩa kiểu dữ liệu cho context được truyền vào mỗi action
declare global {
  interface ActionContext {
    character: InstanceType<any> // Instance của model Character từ Mongoose
    payload: any // Dữ liệu gửi lên từ client
  }
}

// Dòng này là bắt buộc để biến file này thành một module
export {}
