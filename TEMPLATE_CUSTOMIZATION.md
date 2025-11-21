## Template Customization Deep Dive

### Tổng quan

Template customization trong ETS Web cho phép người dùng và admin tạo, chỉnh sửa và quản lý các template cho sự kiện hoặc chia sẻ với cấu trúc linh hoạt, các block nội dung và cài đặt. Hệ thống này hỗ trợ cả default templates (lưu dưới dạng file JSON) và templates do người dùng tạo, cho phép thích ứng nhanh với các loại sự kiện và brand khác nhau.

### Chức năng chính

* Cho phép tạo và chỉnh sửa templates cho trang sự kiện, nền tảng chia sẻ và email.
* Hỗ trợ các dynamic content blocks (text, images, galleries, custom components) thông qua một block editor.
* Cung cấp panel cài đặt cho cấu hình toàn template (màu sắc, layout, quảng cáo, v.v.).
* Cho phép lưu/tải templates dưới dạng JSON để dễ di chuyển và versioning.
* Tích hợp với backend qua API cho các thao tác CRUD và với frontend cho live preview và chỉnh sửa.

### Cách thêm Default Template mới

Default templates được lưu dưới dạng file JSON trong thư mục `/config/`. Để thêm một default template mới:

1. Tạo một file JSON mới trong `/config/` theo mẫu tên:

   * `template-<templateType>-default-<n>.json`
     (trong đó `<n>` là số duy nhất, `<templateType>` (search|share|email) là loại template).
2. File phải tuân theo schema mong đợi (xem các file hiện có để tham khảo).
3. API route tại `/api/template/detail/defaults` (xem `route.ts`) sẽ tự động đọc và expose bất kỳ file nào khớp pattern.
4. Frontend sẽ liệt kê các template này để chọn hoặc duplicate.

### Portable Text Components & Dynamic Block Generation

#### 1. Cấu trúc Block & Khai báo JSON

Portable text components là các block mô-đun, driven-by-schema (ví dụ: text, image, gallery, custom UI) có thể thêm, sắp xếp lại và cấu hình trong template. Mỗi block được khai báo trong JSON template dưới mảng `content`, với trường `_type` chỉ định loại component và các trường khác cho cấu hình.

**Example Block JSON:**

```json
{
	"_type": "feature",
	"title": "Fast Search",
	"description": "Search event images instantly."
}
```

Mỗi key (ngoài `_type`) là một value được truyền như prop cho component React tương ứng.

#### 2. Block Registry & Rendering

Trong `template-generator.tsx`, object `types` đóng vai trò registry ánh xạ chuỗi `_type` của mỗi block tới React component tương ứng. Khi render, hệ thống lookup `_type` của block và truyền các giá trị của nó như props cho component đã đăng ký.

**Feature Component Example:**

```ts
const types = {
	feature: ({ value }: any) => (
		<div className="bg-white/30 backdrop-blur-sm p-4 rounded shadow text-center mb-4">
			<h4 className="text-white font-semibold text-lg">{value.title}</h4>
			<p className="text-white text-sm">{value.description}</p>
		</div>
	),
	footer: FooterComponent, 
	GallerySection: GallerySection, // imported component
	// ...other types
}
```

Registry này được cung cấp cho component `PortableText` từ `@portabletext/react`:

```ts
const components: Partial<PortableTextComponents> = { types }
<PortableText value={content} components={components} />
```

Bất kỳ block nào trong JSON template có `_type: "feature"` sẽ được render bởi function ở trên, hiển thị title và description của nó.

#### 3. Dynamic Block Editor & Sinh trường (Field) động

Block editor (`dynamic-block-editor.tsx`) sinh các input field động cho mỗi block dựa trên các keys của nó (loại trừ `_type`). Với mỗi key, nó sử dụng các pattern regex để xác định loại input sẽ render:

* Keys khớp `/^title\d*/` → string input cho titles
* Keys khớp `/^desc(ription)?\d*/` → textarea cho descriptions
* Keys khớp `/^image(url)?\d*/` hoặc `/logo/` → URL input cho images/logos
* Keys khớp `/color/` → color picker
* Ngược lại, mặc định là string input

Làm function này dynamic giúp không phải thêm thủ công case cho từng loại block. Ngoài ra, trong tương lai có thể thêm các loại trường mới đơn giản và có thể gen dựa theo schema của component (chưa làm).

**Example:**

```json
{
	"_type": "feature",
	"title": "Fast Search",
	"description": "Search event images instantly."
}
```

Điều này sẽ sinh hai string inputs: một cho `title` và một cho `description`, vì regex khớp với những keys đó.

#### 4. Thêm Portable Text Component mới

1. Tạo một React functional component mới.
2. Đăng ký component trong block registry (`template-generator.tsx`, object `types`) với một chuỗi `_type` duy nhất.
3. Cập nhật JSON template để bao gồm các block có `_type` mới và các trường cần thiết.
4. Tùy chọn: mở rộng UI của block editor (`dynamic-block-editor.tsx`) để hỗ trợ các trường tuỳ chỉnh cho loại block mới (thêm regex hoặc logic tùy chỉnh).

#### 5. Mở rộng PortableText

Hệ thống sử dụng `@portabletext/react` để render. Các loại block mới được map trong object `types` và sẽ được render dựa trên trường `_type`. Điều này khiến kiến trúc rất dễ mở rộng và portable giữa các template và sự kiện khác nhau.

#### 6. Email Templates

Email templates được quản lý riêng và sử dụng CKEditor để edit rich text. Cấu trúc `jsonConfig` của chúng khác, thường chứa các trường như `subject`, `source_name`, và `html_content` (xem `template-email-default-1.json`). Email templates không dùng portable text blocks; thay vào đó, nội dung HTML được edit và lưu trực tiếp, cho phép định dạng và cá nhân hóa nâng cao.

### Portable Component Key Naming Strategy

*(Phần này thiếu nội dung trong tài liệu gốc — nếu cần, có thể thêm hướng dẫn đặt tên key để tránh xung đột và dễ tự động hóa.)*

### Settings

Template settings được lưu trong object `settings` bên trong mỗi JSON template. Các cài đặt phổ biến gồm:

* `themeColor`: Color scheme cho template
* `pageTitle`: Title của trang event/share
* `pageSize`: Kích thước phân trang cho galleries
* `privateGallery`: Boolean cho quyền riêng tư gallery
* `pageLogo`: Tên file logo
* `customCSS`: Custom CSS cho styling nâng cao
* `layout`: Loại layout (ví dụ: default, masonry)
  
	Giá trị `layout` trong settings quyết định bố cục và thành phần giao diện được sử dụng cho trang. Ví dụ, với trang search, hệ thống sẽ tra cứu giá trị này để chọn component header/bố cục phù hợp:
  
	```ts
	// Trong SearchPageWrapper
	import { SearchLayoutMap, SearchLayoutKey } from "@/lib/layoutMap/search-map"
	const HeaderComponent = SearchLayoutMap[settings.layout as SearchLayoutKey]?.header ?? SearchLayoutMap.default.header
	<HeaderComponent
		themeColor={settings.themeColor}
		pageTitle={settings.pageTitle}
		pageLogo={settings.pageLogo}
	/>
	```
  
	Nhờ đó, bạn có thể mở rộng hoặc thay đổi bố cục trang chỉ bằng cách cập nhật giá trị `layout` trong template JSON, mà không cần sửa code logic. Các layout mới có thể được thêm vào file ánh xạ như `search-map.ts` hoặc `share-map.ts` trong `lib/layoutMap/`.
* `hasAds`, `adbannerLeft`, `adbannerRight`: Cấu hình quảng cáo
  Settings được chỉnh qua settings panel (xem `settings-panel.tsx`) và phản ánh cả trong live preview lẫn JSON template khi lưu.

### Kiến trúc

* **Frontend:**

  * UI cho template customization được xây bằng React và TypeScript, dùng các component trong `components/customize/` (ví dụ: `dynamic-block-editor.tsx`, `page-customize.tsx`, `preview-panel.tsx`).
  * Block editor cho phép drag-and-drop, inline editing và live preview.
  * Settings panel cung cấp cấu hình toàn bộ template.
  * Templates được load từ API hoặc JSON local, chỉnh sửa và lưu lại qua API.
* **Backend/API:**

  * Default templates được đọc từ `/config/` dưới dạng file JSON (xem `route.ts`).
  * Custom templates được quản lý qua các endpoint API cho CRUD.
  * Type definitions cho templates nằm trong `lib/types/` để đảm bảo type safety.
* **Khả năng mở rộng (Extensibility):**

	* Có thể thêm block types / components mới bằng cách tạo React component mới và cập nhật registry của block editor.
	* Có thể thêm setting mới bằng cách mở rộng schema settings và UI.
	* Default templates dễ dàng di chuyển bằng cách copy file JSON.
	* **Mở rộng layout:**
		- Bạn có thể thêm hoặc thay đổi bố cục trang (layout) chỉ bằng cách cập nhật giá trị `layout` trong template JSON, không cần sửa code logic.
		- Các layout mới được định nghĩa trong file ánh xạ như `search-map.ts` hoặc `share-map.ts` trong thư mục `lib/layoutMap/`.
		- Khi giá trị `layout` thay đổi, hệ thống sẽ tự động tra cứu và sử dụng component/bố cục tương ứng cho trang.

---

