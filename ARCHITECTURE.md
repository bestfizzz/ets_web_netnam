# ETS Web Architecture & API Documentation

---

## 1. Full File Structure (Key Folders & Files)

```
ets_web/
├── .github/
│   └── prompts/
├── app/
│   ├── admin/
│   │   ├── customize/
│   │   ├── share-platform/
│   │   └── url/
│   ├── api/
│   │   ├── auth/
│   │   ├── share/
│   │   ├── template/
│   │   └── url-manager/
│   ├── login/
│   │   └── page.tsx
│   ├── search/
│   │   └── [uuid]/
│   ├── share/
│   │   └── [uuid]/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── app-sidebar.tsx
│   ├── back-button.tsx
│   ├── customize/
│   │   ├── draggable-block.tsx
│   │   ├── dynamic-block-editor.tsx
│   │   ├── email-editor.tsx
│   │   ├── inline-preview.tsx
│   │   ├── page-customize.tsx
│   │   ├── preview-panel.tsx
│   │   ├── template-generator.tsx
│   │   └── setting_blocks/
│   │       ├── blocks-panel.tsx
│   │       ├── name-and-add.tsx
│   │       └── settings-panel.tsx
│   ├── header.tsx
│   ├── layout-admin.tsx
│   ├── login/
│   │   └── login-form.tsx
│   ├── nav-user.tsx
│   ├── pages/
│   │   ├── ad-banner.tsx
│   │   ├── gallery-content-section.tsx
│   │   ├── gallery-section.tsx
│   │   ├── image-component-grid.tsx
│   │   ├── image-content-section.tsx
│   │   ├── image-grid.tsx
│   │   ├── image-section.tsx
│   │   ├── masonry-grid.tsx
│   │   ├── search/
│   │   │   ├── components/
│   │   │   ├── no-results.tsx
│   │   │   ├── pagination-bar.tsx
│   │   │   ├── search-header-1.tsx
│   │   │   ├── search-header.tsx
│   │   │   ├── search-page-wrapper.tsx
│   │   │   ├── search-selection-drawer.tsx
│   │   │   └── upload-modal.tsx
│   │   ├── share/
│   │   │   ├── share-header.tsx
│   │   │   ├── share-page-wrapper.tsx
│   │   │   └── share-selection-drawer.tsx
│   ├── share/
│   │   ├── share-detail-client.tsx
│   │   ├── share-detail-table.tsx
│   │   ├── share-form-modal.tsx
│   │   ├── share-platform-modal.tsx
│   │   └── share-table.tsx
│   ├── skeleton-loading.tsx
│   ├── ui/ # Shadcn UI components
│   │   ├── ...
│   ├── url/
│   │   ├── url-form.tsx
│   │   ├── url-modals.tsx
│   │   └── url-table.tsx
├── config/
│   ├── exschema.json
│   ├── template-email-default-1.json
│   ├── template-email-default-2.json
│   ├── template-search-default-1.json
│   ├── template-search-default-2.json
│   ├── template-search-default-3.json
│   ├── template-share-default-1.json
│   ├── template-share-default-2.json
│   └── template-share-default-3.json
├── hooks/
│   ├── gallery-context.tsx
│   ├── use-fancybox.ts
│   └── use-mobile.ts
├── lib/
│   ├── api.ts
│   ├── client_api/
│   ├── http.ts
│   ├── layoutMap/
│   ├── logger/
│   ├── server_api/
│   ├── types/
│   ├── uploadAsset.ts
│   └── utils.ts
├── logs/
│   └── app.log
├── public/
│   ├── ckeditor/
│   ├── images/
│   ├── logo/
│   └── placeholder/
├── Dockerfile
├── docker-compose.yaml
├── package.json
├── README.md
└── tsconfig.json
```
---
## 2. Tổng Quan Ứng Dụng, Mục Đích & Phạm Vi

**Overview:**
ETS Web là một nền tảng modular, domain-driven để tìm kiếm và chia sẻ hình ảnh sự kiện. Người dùng có thể truy cập public search và share pages bằng cách biết UUID duy nhất của event. Ban tổ chức (admin) sử dụng dashboard để tạo event URL, cấu hình credentials cho việc gửi check-in messages lên các social platforms khác nhau, và tùy chỉnh templates cho cả website và email. Ứng dụng được xây dựng bằng React, Next.js, Node.js, TypeScript, Docker và CKEditor, theo kiến trúc phân lớp để dễ bảo trì và mở rộng.

**Purpose:**
Cung cấp một nền tảng linh hoạt và có khả năng mở rộng nhằm:

* Cho phép người dùng public tìm kiếm hình ảnh sự kiện và xem/chia sẻ trang sự kiện thông qua các URL dựa trên UUID.
* Cho phép organizers quản lý event URLs, cấu hình social platform messaging và tùy chỉnh website/email templates cho từng event.
  Nền tảng được thiết kế để dễ tùy chỉnh, quản lý bảo mật và mở rộng việc chia sẻ nội dung liên quan đến sự kiện.

**Scope:**

* **Public Access:** Các trang search và share có thể được truy cập bởi bất kỳ ai có UUID của sự kiện.
* **Admin Dashboard:** Tạo/quản lý event URLs, cấu hình social platform credentials và gửi check-in messages.
* **Template Customization:** Admin có thể tạo và chỉnh sửa templates cho website và email theo từng event.
* **Content Search & Sharing:** Tìm kiếm hình ảnh sự kiện, chia sẻ các trang sự kiện.
* **User Authentication:** Login và các route dành cho admin được bảo vệ.
* **UI Components:** Các thành phần UI dùng lại, domain-specific và generic.
* **API Layer:** Logic backend dạng mô-đun cho authentication, sharing, templates và URL management.
* **Configuration:** Templates và schemas dựa trên JSON để modeling dữ liệu linh hoạt.
* **Deployment:** Container hóa bằng Docker để đảm bảo môi trường đồng nhất.

---

## 3. Main Functionalities — **Các Chức Năng Chính**

* **Customizable Admin Features:** Drag-and-drop blocks, dynamic editors, template generation.
* **User Login & Authentication:** Form đăng nhập an toàn, protected routes.
* **Content Search:** Advanced search với pagination, filtering và upload modal.
* **Content Sharing:** Share detail views, share forms, platform integration.
* **Reusable UI Components:** Buttons, dialogs, tables, forms, tooltips, v.v.
* **API Integration:** Client và server API modules cho data access và business logic.
* **Configuration Management:** Dễ dàng cập nhật templates và schemas qua các file JSON.
* **Logging & Monitoring:** Logging cơ bản, có thể mở rộng cho monitoring nâng cao.
* **Extensibility:** Thêm tính năng bằng cách tạo components, API routes hoặc config templates mới.

---

## 4. Architecture Overview — **Tổng Quan Kiến Trúc**

* **Frontend:** Ứng dụng Next.js (React), sử dụng Tailwind CSS để styling.
* **Backend/API:** Next.js API routes (ở `/app/api/`), xử lý server-side cho templates và asset management.
* **Customization:** Admin UI để tùy chỉnh templates và pages (`/app/admin/customize`).
* **Utilities:** Các hàm tiện ích dùng chung trong [`lib/utils.ts`](lib/utils.ts), gồm formatting và download helpers.
* **Logging:** Custom logger tại [`lib/logger/logger.ts`](lib/logger/logger.ts).
* **CKEditor Integration:** Rich text editing thông qua CKEditor (thư mục `/public/ckeditor/`).

---

## 5. API & Types Overview — **Tổng Quan API & TypeScript Types**

API của ứng dụng hoạt động như một proxy, chuyển tiếp các request từ frontend đến backend server. Thiết kế dùng centralized API management:

* **client_api/** được gọi từ frontend browser, tương tác với Next.js backend (proxy layer).
* **server_api/** được sử dụng bởi Next.js backend để giao tiếp với backend server thật nhằm xử lý và quản lý dữ liệu.
* Với hầu hết tương tác của user (trừ asset calls), luồng như sau:
  **User → client_api → Next.js API (proxy) → server_api → Backend server**
* Asset calls (như upload/download ảnh) gọi trực tiếp backend server để tối ưu hiệu năng và scalability.

Sự tách biệt này giúp rõ ràng ranh giới, tập trung API logic và dễ bảo trì. Tất cả giao tiếp API đều type-safe nhờ TypeScript.

### API Structure — Cấu trúc API

**Server API:**

* Tất cả backend server endpoints được implement trong `/app/api/` dùng Next.js API routes.
* Business logic nằm trong `lib/server_api/` (vd: `auth.ts`, `share-detail.ts`, `template-detail.ts`).

**Client API:**

* Frontend gọi đến Next.js backend qua modules ở `lib/client_api/` (vd: `auth.client.ts`).
* Các module này wrap HTTP requests, xử lý error và validation.

**HTTP Utilities:**

* Shared HTTP logic (fetch, error handling, ...) nằm ở `lib/http.ts` để tạo luồng request/response nhất quán.

### TypeScript Types

**Types Folder:**

* Tất cả request/response types, schemas và domain models nằm trong `lib/types/` (ví dụ: `auth.ts`, `share-detail.ts`, `template-detail.ts`).
* Được sử dụng bởi cả client và server để đảm bảo type safety.

**Validation:**

* Dùng kết hợp Zod schemas và type checking để giảm lỗi và dễ maintain.

### Example API Flow — Ví dụ luồng API

1. **Frontend** gọi hàm trong `lib/client_api/auth.client.ts` để login user.
2. Client API dùng `lib/http.ts` gửi POST request tới `/api/auth/login`.
3. Server API tại `/app/api/auth/login/route.ts` dùng types từ `lib/types/auth.ts` để validate, xử lý và trả response.
4. Client API parse response và trả dữ liệu typed về frontend.

---

## Key Endpoints — **Các Endpoint Quan Trọng**

### Authentication

* **POST `/api/auth/login`** — Login, trả JWT.
* **POST `/api/auth/logout`** — Logout, clear cookies.

### Event Sharing

* **GET `/api/share/details`** — List tất cả share details (yêu cầu auth).
* **POST `/api/share/details`** — Tạo share detail mới (auth).
* **GET `/api/share/details/[id]`** — Lấy detail cụ thể.
* **GET `/api/share/platforms`** — List các share platforms (auth).
* **POST `/api/share/platforms`** — Tạo platform mới (auth).
* **GET `/api/share/platforms/[id]`** — Lấy platform cụ thể.

### Template Management

* **GET `/api/template/detail/defaults`** — Trả tất cả default template JSON từ `/config/` (public).
* **GET `/api/template/detail/[id]`** — Lấy template theo ID (auth).
* **GET `/api/template/type`** — List template types (auth).
* **POST `/api/template/type`** — Tạo template type mới (auth).

### URL Management

* **GET `/api/url-manager`** — List URL managers (auth).
* **POST `/api/url-manager`** — Tạo URL manager mới (auth).
* **GET `/api/url-manager/[uuid]`** — Lấy chi tiết event URL cụ thể (auth).

---