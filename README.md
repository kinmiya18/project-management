# Project Management System

Hệ thống quản lý project và file cấu hình được xây dựng với Node.js, Express và MongoDB theo mô hình MVC.

## Tính năng

- **Quản lý Projects**: Tạo, sửa, xóa và xem danh sách projects
- **Quản lý Config Files**: Thêm, sửa, xóa file cấu hình cho từng project
- **Xem nội dung file**: Hiển thị nội dung file cấu hình với syntax highlighting
- **Responsive UI**: Giao diện thân thiện, responsive với Tailwind CSS
- **API RESTful**: Backend API hoàn chỉnh với validation
- **Real-time feedback**: Thông báo trạng thái và loading indicators

## Cấu trúc thư mục

```
project-management-system/
├── controllers/
│   ├── projectController.js    # Controller xử lý logic projects
│   └── configController.js     # Controller xử lý logic configs
├── models/
│   └── Project.js              # Model MongoDB cho projects
├── routes/
│   ├── projectRoutes.js        # Routes cho projects API
│   └── configRoutes.js         # Routes cho configs API
├── views/
│   └── index.ejs               # Template HTML chính
├── public/
│   └── js/
│       └── app.js              # Frontend JavaScript
├── app.js                      # File chính của ứng dụng
├── package.json                # Dependencies và scripts
├── .env                        # Biến môi trường
└── README.md                   # Tài liệu dự án
```

## Cài đặt

### Yêu cầu hệ thống
- Node.js (v14 trở lên)
- MongoDB (v4.0 trở lên)
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd project-management-system
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Thiết lập MongoDB
- Khởi động MongoDB service
- Tạo database `project_management` (tự động tạo khi chạy ứng dụng)

### Bước 4: Cấu hình môi trường
Tạo file `.env` với nội dung:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/project_management
NODE_ENV=development
```

### Bước 5: Chạy ứng dụng
```bash
# Development mode với nodemon
npm run dev

# Production mode
npm start
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## API Endpoints

### Projects API

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/projects` | Lấy danh sách tất cả projects |
| GET | `/api/projects/:id` | Lấy thông tin project theo ID |
| POST | `/api/projects` | Tạo project mới |
| PUT | `/api/projects/:id` | Cập nhật project |
| DELETE | `/api/projects/:id` | Xóa project |

### Configs API

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/configs/:projectId` | Thêm config vào project |
| GET | `/api/configs/:projectId/:configId` | Lấy thông tin config |
| PUT | `/api/configs/:projectId/:configId` | Cập nhật config |
| DELETE | `/api/configs/:projectId/:configId` | Xóa config |

## Cấu trúc dữ liệu

### Project Schema
```javascript
{
  _id: ObjectId,
  key: String,           // Mã định danh project (unique, uppercase)
  name: String,          // Tên project
  configs: [             // Mảng các config files
    {
      _id: ObjectId,
      file_name: String,     // Tên file
      mount_point: String,   // Đường dẫn mount
      file_content: String,  // Nội dung file
      createdAt: Date,
      updatedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## Validation Rules

### Project Validation
- **key**: Bắt buộc, 3-20 ký tự, chỉ chứa chữ hoa, số và dấu gạch dưới, unique
- **name**: Bắt buộc, 2-100 ký tự

### Config Validation
- **file_name**: Bắt buộc, 1-100 ký tự, unique trong cùng project
- **mount_point**: Bắt buộc, 1-200 ký tự
- **file_content**: Tùy chọn, tối đa 10,000 ký tự

## Sử dụng

### 1. Tạo Project mới
- Click vào nút "Thêm Project"
- Nhập tên project và mã định danh
- Mã định danh sẽ tự động chuyển thành chữ hoa

### 2. Quản lý Configs
- Click "Chi tiết" trên project card để xem configs
- Sử dụng "Thêm Config" để thêm file cấu hình mới
- Click vào tên file để xem nội dung
- Sử dụng nút "Edit" và "Xóa" để quản lý configs

### 3. Xem nội dung file
- Click vào tên file trong bảng configs
- Nội dung hiển thị với format terminal-style

## Tính năng Frontend

### UI/UX Features
- **Responsive Design**: Tương thích với mobile và desktop
- **Loading States**: Hiển thị trạng thái loading khi xử lý
- **Notifications**: Thông báo success/error với auto-dismiss
- **Modal Dialogs**: Giao diện modal cho forms
- **Keyboard Support**: Đóng modal bằng phím ESC
- **Form Validation**: Validation phía client trước khi gửi API

### JavaScript Features
- **API Integration**: Kết nối với backend API
- **Error Handling**: Xử lý lỗi từ server và network
- **State Management**: Quản lý state của ứng dụng
- **Event Delegation**: Xử lý events hiệu quả
- **HTML Escaping**: Bảo mật chống XSS attacks

## Cấu trúc MVC

### Model (models/Project.js)
- Định nghĩa schema MongoDB với Mongoose
- Validation rules và middleware
- Virtual fields và methods

### View (views/index.ejs)
- Template HTML với EJS
- Responsive UI với Tailwind CSS
- Modal dialogs và components

### Controller (controllers/)
- **projectController.js**: Xử lý logic cho projects
- **configController.js**: Xử lý logic cho configs
- Error handling và validation
- Response formatting

### Routes (routes/)
- **projectRoutes.js**: Định nghĩa endpoints cho projects
- **configRoutes.js**: Định nghĩa endpoints cho configs
- Middleware validation với express-validator

## Development

### Scripts có sẵn
```bash
npm start          # Chạy production server
npm run dev        # Chạy development server với nodemon
```

### Environment Variables
```bash
PORT=3000                                    # Port server
MONGODB_URI=mongodb://localhost:27017/...   # MongoDB connection string
NODE_ENV=development                         # Environment mode
```

### Dependencies chính
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **ejs**: Template engine
- **body-parser**: Parse request bodies
- **express-validator**: Request validation
- **method-override**: HTTP method override
- **dotenv**: Environment variables

## Troubleshooting

### Lỗi thường gặp

1. **MongoDB connection failed**
   - Kiểm tra MongoDB service đã chạy chưa
   - Verify connection string trong `.env`

2. **Port đã được sử dụng**
   - Thay đổi PORT trong `.env`
   - Hoặc kill process đang sử dụng port

3. **Validation errors**
   - Kiểm tra format dữ liệu input
   - Xem console browser để debug

4. **API không response**
   - Kiểm tra server đã chạy chưa
   - Verify network connection
   - Check browser console for errors

## Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## Contact

Nếu có câu hỏi hoặc cần hỗ trợ, vui lòng tạo issue trên GitHub repository.