# AI Search API Documentation

## Tổng quan

AI Search là một hệ thống tìm kiếm hình ảnh thông minh tích hợp với Immich API. Hệ thống cung cấp các tính năng tìm kiếm bằng khuôn mặt, quản lý album, và xử lý hình ảnh.

**Base URL:** `http://localhost:3000` (development) / `https://your-domain.com` (production)
**API Version:** v1

---

## Xác thực (Authentication)

### Phương thức xác thực
- **JWT Bearer Token**: Sử dụng header `Authorization: Bearer <token>`
- **Local Strategy**: Xác thực bằng email/password

### Guards sử dụng
- `LocalAuthGuard`: Cho endpoint đăng nhập
- `JwtAuthGuard`: Cho các endpoint cần xác thực

---

## 📋 Authentication API

### 1. Đăng nhập

**Endpoint:** `POST /auth/signin`

**Mô tả:** Xác thực người dùng và trả về JWT token

**Authentication:** LocalAuthGuard

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation:**
- `email`: Bắt buộc, phải là email hợp lệ
- `password`: Bắt buộc, kiểu string

**Response Success (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires": 1640995200
}
```

**Response Error:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Authentication failed"
}
```

---

## 🖼️ Assets API

Tất cả endpoints trong module này yêu cầu JWT authentication.

### 1. Upload Asset

**Endpoint:** `POST /assets`

**Mô tả:** Upload hình ảnh lên hệ thống

**Authentication:** JWT Required

**Request:**
- **Content-Type:** `multipart/form-data`
- **File field:** `assetData`
- **Body fields:**
  - `uuid`: string (bắt buộc) - UUID của user

**File Constraints:**
- Định dạng cho phép: JPEG, PNG, GIF, WebP, JPG
- Kích thước tối đa: 2MB

**Response Success (201):**
```json
{
  "statusCode": 201,
  "message": "Asset uploaded successfully",
  "data": {
    "assetId": "asset-uuid-123",
    "filename": "image.jpg",
    "size": 1024000
  }
}
```

**Response Error (400):**
```json
{
  "statusCode": 400,
  "message": "Only image files are allowed!"
}
```

### 2. Lấy thông tin Asset

**Endpoint:** `GET /assets/info/:uuid`

**Mô tả:** Lấy thông tin chi tiết của một asset

**Authentication:** JWT Required

**Parameters:**
- `uuid`: string (path) - UUID của user
- `assetId`: string (query) - ID của asset

**Request Example:**
```
GET /assets/info/user-uuid-123?assetId=asset-123
```

**Response Success (200):**
```json
{
  "id": "asset-123",
  "filename": "image.jpg",
  "type": "IMAGE",
  "originalFileName": "original.jpg",
  "deviceAssetId": "device-123",
  "fileCreatedAt": "2023-12-01T10:00:00Z",
  "fileModifiedAt": "2023-12-01T10:00:00Z",
  "exifInfo": {
    "make": "Canon",
    "model": "EOS 5D",
    "dateTimeOriginal": "2023-12-01T10:00:00Z"
  }
}
```

### 3. Lấy thông tin Person

**Endpoint:** `GET /assets/person/:uuid/`

**Mô tả:** Lấy danh sách assets của một person

**Authentication:** JWT Required

**Parameters:**
- `uuid`: string (path) - UUID của user
- `personId`: string (query) - ID của person

**Request Example:**
```
GET /assets/person/user-uuid-123/?personId=person-123
```

**Response Success (200):**
```json
{
  "id": "person-123",
  "name": "John Doe",
  "assets": [
    {
      "id": "asset-1",
      "filename": "photo1.jpg",
      "thumbnail": "thumbnail-url"
    },
    {
      "id": "asset-2", 
      "filename": "photo2.jpg",
      "thumbnail": "thumbnail-url"
    }
  ],
  "totalAssets": 25
}
```

### 4. Lấy Person với phân trang

**Endpoint:** `GET /assets/person/:uuid/page`

**Mô tả:** Lấy assets của person với phân trang

**Authentication:** JWT Required

**Parameters:**
- `uuid`: string (path) - UUID của user
- `personId`: string (query, required) - ID của person  
- `page`: number (query, required) - Số trang
- `size`: number (query, required) - Số items mỗi trang

**Request Example:**
```
GET /assets/person/user-uuid-123/page?personId=person-123&page=1&size=20
```

**Response Success (200):**
```json
{
  "data": [
    {
      "id": "asset-1",
      "filename": "photo1.jpg",
      "thumbnail": "thumbnail-url"
    }
  ],
  "pagination": {
    "page": 1,
    "size": 20,
    "totalPages": 5,
    "totalItems": 100
  }
}
```

### 5. Thống kê Person

**Endpoint:** `GET /assets/person/:uuid/statistics`

**Mô tả:** Lấy thống kê số lượng assets của person

**Authentication:** JWT Required

**Parameters:**
- `uuid`: string (path) - UUID của user
- `personId`: string (query) - ID của person

**Response Success (200):**
```json
{
  "personId": "person-123",
  "totalAssets": 156,
  "totalVideos": 12,
  "totalPhotos": 144,
  "dateRange": {
    "earliest": "2020-01-01T00:00:00Z",
    "latest": "2023-12-01T15:30:00Z"
  }
}
```

### 6. Lấy Thumbnail

**Endpoint:** `GET /assets/thumbnail/:uuid`

**Mô tả:** Lấy thumbnail của asset

**Authentication:** JWT Required

**Parameters:**
- `uuid`: string (path) - UUID của user
- `assetId`: string (query) - ID của asset
- `size`: string (query, optional) - Kích thước thumbnail (default: "thumbnail")

**Request Example:**
```
GET /assets/thumbnail/user-uuid-123?assetId=asset-123&size=preview
```

**Response:** Binary image data

**Headers:**
- `Content-Type`: image/jpeg
- `Content-Disposition`: inline; filename="image-from-api.jpg"

### 7. Lấy hình ảnh gốc

**Endpoint:** `GET /assets/image/:uuid`

**Mô tả:** Download hình ảnh gốc

**Authentication:** JWT Required

**Parameters:**
- `uuid`: string (path) - UUID của user
- `assetId`: string (query) - ID của asset

**Response:** Binary image data

**Headers:**
- `Content-Type`: image/jpeg (hoặc định dạng gốc)
- `Content-Disposition`: attachment; filename="asset-123.jpg"

### 8. Kiểm tra URL

**Endpoint:** `GET /assets/check-url/:uuid`

**Mô tả:** Kiểm tra tính hợp lệ của URL Immich

**Authentication:** JWT Required

**Parameters:**
- `uuid`: string (path) - UUID của user

**Response Success (200):**
```json
{
  "status": "valid",
  "connected": true,
  "serverVersion": "1.88.0"
}
```

### 9. Xóa Assets

**Endpoint:** `DELETE /assets/:uuid`

**Mô tả:** Xóa một hoặc nhiều assets

**Authentication:** JWT Required

**Parameters:**
- `uuid`: string (path) - UUID của user

**Request Body:**
```json
{
  "ids": ["asset-1", "asset-2", "asset-3"]
}
```

**Response Success (200):**
```json
{
  "status": 200,
  "message": "ok"
}
```

### 10. Lấy tất cả Asset IDs

**Endpoint:** `GET /assets/:uuid/getAllAssetsId`

**Mô tả:** Lấy danh sách ID của tất cả assets với phân trang

**Authentication:** JWT Required

**Parameters:**
- `uuid`: string (path) - UUID của user
- `page`: number (query, required) - Số trang
- `size`: number (query, required) - Số items mỗi trang

**Request Example:**
```
GET /assets/user-uuid-123/getAllAssetsId?page=1&size=50
```

**Response Success (200):**
```json
{
  "data": [
    "asset-id-1",
    "asset-id-2", 
    "asset-id-3"
  ],
  "pagination": {
    "page": 1,
    "size": 50,
    "totalPages": 20,
    "totalItems": 1000
  }
}
```

---

## 📁 Albums API

Tất cả endpoints trong module này yêu cầu JWT authentication.

### 1. Lấy tất cả Albums

**Endpoint:** `GET /albums`

**Mô tả:** Lấy danh sách tất cả albums

**Authentication:** JWT Required

**Response Success (200):**
```json
{
  "data": [
    {
      "id": "album-1",
      "albumName": "Vacation 2023",
      "description": "Summer vacation photos",
      "assetCount": 45,
      "albumThumbnailAssetId": "thumb-asset-1",
      "createdAt": "2023-06-01T00:00:00Z"
    }
  ]
}
```

### 2. Lấy Album theo ID

**Endpoint:** `GET /albums/:id`

**Mô tả:** Lấy thông tin chi tiết một album

**Authentication:** JWT Required

**Parameters:**
- `id`: string (path) - ID của album

**Response Success (200):**
```json
{
  "id": "album-1",
  "albumName": "Vacation 2023", 
  "description": "Summer vacation photos",
  "assetCount": 45,
  "assets": [
    {
      "id": "asset-1",
      "filename": "beach.jpg"
    }
  ],
  "owner": {
    "id": "user-1",
    "email": "user@example.com"
  }
}
```

### 3. Tạo Album

**Endpoint:** `POST /albums`

**Mô tả:** Tạo album mới

**Authentication:** JWT Required

**Request Body:** (Chưa được implement đầy đủ trong controller)
```json
{
  "name": "New Album",
  "description": "Album description"
}
```

### 4. Cập nhật Album

**Endpoint:** `PUT /albums/:id` (Endpoint bị trùng với GET)

**Mô tả:** Cập nhật thông tin album

**Authentication:** JWT Required

**Parameters:**
- `id`: string (path) - ID của album

**Note:** Endpoint này có vẻ bị config sai trong controller (trùng route với GET)

### 5. Xóa Album

**Endpoint:** `DELETE /albums/:id`

**Mô tả:** Xóa album

**Authentication:** JWT Required

**Parameters:**
- `id`: string (path) - ID của album

---

## 🔗 URL Manager API

Tất cả endpoints trong module này yêu cầu JWT authentication.

### 1. Tạo URL Manager

**Endpoint:** `POST /url-manager`

**Mô tả:** Tạo URL manager mới cho user

**Authentication:** JWT Required

**Request Body:**
```json
{
  "name": "My Immich Server"
}
```

**Validation:**
- `name`: Bắt buộc, kiểu string

**Response Success (201):**
```json
{
  "id": 1,
  "uuid": "uuid-generated-123",
  "name": "My Immich Server",
  "userId": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### 2. Lấy tất cả URL Managers

**Endpoint:** `GET /url-manager`

**Mô tả:** Lấy danh sách URL managers của user hiện tại

**Authentication:** JWT Required

**Response Success (200):**
```json
{
  "data": [
    {
      "id": 1,
      "uuid": "uuid-123",
      "name": "My Immich Server"
    },
    {
      "id": 2, 
      "uuid": "uuid-456",
      "name": "Backup Server"
    }
  ],
  "userInfo": {
    "userId": 1,
    "email": "user@example.com",
    "immichId": 12345
  }
}
```

### 3. Lấy URL Manager theo UUID

**Endpoint:** `GET /url-manager/:id`

**Mô tả:** Lấy thông tin chi tiết URL manager theo UUID

**Authentication:** JWT Required

**Parameters:**
- `uuid`: string (path) - UUID của URL manager

**Note:** Trong code có vẻ param name bị sai (dùng uuid nhưng param name là :id)

### 4. Cập nhật URL Manager

**Endpoint:** `PATCH /url-manager/:id`

**Mô tả:** Cập nhật thông tin URL manager

**Authentication:** JWT Required

**Parameters:**
- `id`: number (path) - ID của URL manager

**Request Body:**
```json
{
  "name": "Updated Server Name"
}
```

### 5. Xóa URL Manager

**Endpoint:** `DELETE /url-manager/:id`

**Mô tả:** Xóa URL manager

**Authentication:** JWT Required

**Parameters:**
- `id`: number (path) - ID của URL manager

---

## 📊 Data Models

### User Entity
```typescript
{
  id: number;           // Primary key
  email: string;        // Unique, max 50 chars
  password: string;     // Excluded from output (256 chars)
}
```

### UrlManager Entity
```typescript
{
  id: number;           // Primary key
  uuid: string;         // Auto-generated UUID
  name: string;         // Tên server
  userId: User;         // Relation to User (excluded from output)
}
```

### ImmichUserInfo Entity
```typescript
{
  id: number;                    // Primary key
  accessToken: string;           // Token để kết nối Immich
  userImmichId: string;         // ID trong hệ thống Immich
  userEmail: string;            // Email trong Immich
  isAdmin: boolean;             // Quyền admin
  profileImagePath: string;     // Đường dẫn ảnh đại diện
  userId: User;                 // Relation to User
}
```

---

## 🛡️ Error Handling

### HTTP Status Codes sử dụng

- **200 OK**: Request thành công
- **201 Created**: Tạo resource thành công  
- **400 Bad Request**: Dữ liệu đầu vào không hợp lệ
- **401 Unauthorized**: Chưa xác thực hoặc token không hợp lệ
- **403 Forbidden**: Không có quyền truy cập
- **404 Not Found**: Resource không tồn tại
- **500 Internal Server Error**: Lỗi server

### Định dạng Error Response

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Email must be a valid email"
    }
  ]
}
```

---

## 🔧 Environment Variables

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=ai_search_2
DATABASE_PASSWORD=your_password
DATABASE_NAME=ai_search_2

# JWT
API_SECRET=your_jwt_secret
API_EXPIRE_TIME=2h

# Immich Integration
IMMICH_HOSTNAME=https://your-immich-server.com/api
DETECH_FACE=http://your-face-detection-server:8000

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_METHODS=GET,PUT,POST,DELETE
CORS_HEADERS=Content-Type,Authorization
CORS_CREDENTIALS=true
```

---

## 📝 Validation Rules

### Common Validations
- **Email**: Phải là định dạng email hợp lệ
- **String fields**: Không được rỗng khi required
- **File uploads**: Chỉ chấp nhận image formats (JPEG, PNG, GIF, WebP)
- **File size**: Tối đa 2MB cho upload

### Custom Pipes
- `CustomQueryPipe`: Xử lý và validate query parameters

---

## 🚀 Rate Limiting & Security

### Guards
- **LocalAuthGuard**: Sử dụng Passport Local Strategy
- **JwtAuthGuard**: Sử dụng Passport JWT Strategy

### Security Headers
- CORS được config cho các origin được phép
- File upload được restrict theo MIME type
- Password được hash và exclude khỏi response

---

## 📱 Integration với Immich

API này hoạt động như một proxy/wrapper cho Immich API:
- Xác thực qua Immich server
- Proxy các request assets, thumbnails
- Caching thông tin user từ Immich
- Face detection integration

---

## 🧪 Testing

### Postman Collection
Có thể test API bằng các tool như Postman với:

1. **Setup Environment:**
   - `base_url`: http://localhost:3000
   - `jwt_token`: Token từ login endpoint

2. **Authentication Flow:**
   - POST /auth/signin để lấy token
   - Sử dụng token trong header cho các API khác

3. **File Upload Testing:**
   - Sử dụng form-data với key `assetData`
   - Đính kèm file image hợp lệ

---

## 📞 Support & Contact

Để báo cáo lỗi hoặc yêu cầu tính năng mới, vui lòng tạo issue trên repository hoặc liên hệ team phát triển.

**Version:** 1.0.0  
**Last Updated:** December 2024