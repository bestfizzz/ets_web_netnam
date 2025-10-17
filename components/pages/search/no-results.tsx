"use client"

export default function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-20">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy ảnh</h2>
      <p className="text-gray-600 max-w-md">
        Có thể do ảnh không chứa khuôn mặt hoặc có lỗi xảy ra khi xử lý.
      </p>
      <div className="mt-6 text-gray-700 text-sm bg-gray-50 border rounded-lg p-4 max-w-sm">
        <p className="font-medium mb-1">Lời khuyên:</p>
        <ul className="text-left list-disc list-inside space-y-1">
          <li>Thử upload ảnh khác có khuôn mặt rõ ràng và đủ sáng.</li>
        </ul>
      </div>
    </div>
  )
}
