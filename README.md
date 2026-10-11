# Movie Watchlist — React Native + TypeScript

Bài thực hành môn **Lập trình di động**: xây dựng ứng dụng Movie Watchlist bằng React Native, TypeScript và Expo Snack. Ứng dụng lấy danh sách phim từ MockAPI và hỗ trợ hiển thị, lọc, chọn phim.

## 1. Công nghệ sử dụng

- React Native + TypeScript
- Expo Snack
- MockAPI (`movies` resource)
- `react-native-safe-area-context`
- React Hooks: `useState`, `useEffect`, `useCallback`, `useMemo`
- `FlatList`, `ActivityIndicator`, `Switch`, `RefreshControl`, `Alert`

## 2. Chuẩn bị MockAPI

1. Truy cập [mockapi.io](https://mockapi.io/) và tạo project.
2. Tạo resource tên **`movies`**.
3. Tạo các trường dữ liệu:

| Trường | Kiểu dữ liệu | Mô tả |
|---|---|---|
| `id` | String | MockAPI tự sinh |
| `title` | String | Tên phim |
| `director` | String | Đạo diễn |
| `year` | Number | Năm phát hành |
| `rating` | Number | Điểm đánh giá từ 0 đến 10 |
| `poster` | String | URL ảnh poster, tỉ lệ 2:3 |
| `watched` | Boolean | `true` nếu đã xem, `false` nếu chưa xem |

4. Thêm ít nhất **9 bản ghi**, gồm cả phim đã xem (`watched: true`) và chưa xem (`watched: false`).
5. Sao chép URL resource có dạng:

   ```text
   https://YOUR-ID.mockapi.io/movies
   ```

## 3. Thiết lập Expo Snack

1. Mở [Expo Snack](https://snack.expo.dev/).
2. Dán mã ứng dụng vào file `App.tsx`.
3. Tạo file `components/MovieCard.tsx` và dán mã component `MovieCard`.
4. Trong Dependencies, thêm `react-native-safe-area-context` nếu project chưa có. Nên để Snack chọn phiên bản tương thích với Expo SDK đang dùng.

## 4. Nội dung thực hiện theo từng câu

### Câu 1 — Safe Area và tiêu đề

- Bọc ứng dụng trong `SafeAreaProvider` và `SafeAreaView` từ `react-native-safe-area-context`.
- Hiển thị tiêu đề **Movie Watchlist** ở đầu màn hình.

### Câu 2 — Gọi API và hiển thị danh sách

- Gọi `fetchMovies()` khi màn hình mở.
- Hiển thị `ActivityIndicator` trong lúc tải dữ liệu.
- Hiển thị danh sách bằng `FlatList` và khai báo `keyExtractor`.
- Mỗi phim hiển thị tên phim, điểm đánh giá ⭐ và trạng thái:
  - `✅ Đã xem`
  - `🎬 Chưa xem`
- Nếu gọi API thất bại, hiển thị thông báo màu đỏ **Không tải được danh sách phim.** cùng nút **Thử lại**.
- Khi bấm **Thử lại**, gọi API lần nữa.

### Câu 3 — Component MovieCard

- Tạo `components/MovieCard.tsx`.
- Khai báo `interface Movie` gồm `id`, `title`, `director`, `year`, `rating`, `poster` và `watched`.
- Khai báo `interface MovieCardProps`.
- Thẻ phim hiển thị poster bên trái; bên phải hiển thị tên phim, đạo diễn · năm, điểm đánh giá làm tròn một chữ số thập phân và trạng thái xem.
- Khi bấm thẻ, gọi `onSelect(movie.id)`.
- Trong `App`, hiển thị `Alert` gồm tên phim và dòng `Đạo diễn: …`.
- Bọc component bằng `React.memo` và dùng `useCallback` cho hàm xử lý chọn phim.

### Câu 4 — Hai kiểu bố cục

Dùng **một component `MovieCard`** với prop `layout?: "row" | "poster"` và mặc định là `"row"`.

- **`row`:** thẻ nằm ngang, poster kích thước `70 × 105`, hiển thị đầy đủ thông tin như Câu 3.
- **`poster`:** thẻ xếp dọc; poster có tỉ lệ `2:3`, co giãn theo chiều rộng; huy hiệu ⭐ nằm ở góc trên phải; chip `✓ Đã xem` nằm ở góc dưới trái và chỉ hiện với phim đã xem. Ẩn đạo diễn, năm và dòng trạng thái.
- Bố cục poster hiển thị **2 cột**. Mỗi ô có chiều rộng cố định 50% để thẻ cuối của một danh sách có số phim lẻ không bị kéo giãn toàn hàng.
- Để chụp minh chứng theo yêu cầu “đổi bằng hằng số”, tạm dùng hằng số trong `App`, ví dụ `const POSTER_MODE = true`, rồi đổi giá trị để chụp cả hai kiểu bố cục. Sau đó có thể chuyển sang `Switch` ở Câu 5.

### Câu 5 — Công tắc và bộ lọc

Thêm hai `Switch` ngay dưới tiêu đề:

- **Dạng poster:** bật để hiển thị poster 2 cột; tắt để hiển thị dạng row 1 cột.
- **Chưa xem:** bật để chỉ hiển thị phim có `watched === false`; tắt để hiển thị tất cả phim.
- Hai công tắc hoạt động độc lập.
- Dùng `useMemo` để tính danh sách phim đã lọc.
- Đặt `key={layout}` cho `FlatList` để danh sách được tạo lại khi đổi `numColumns`, tránh lỗi khi chuyển giữa 1 và 2 cột.
- Giữ các công tắc bên ngoài `FlatList` để trạng thái lựa chọn không bị ảnh hưởng khi cuộn hoặc làm mới danh sách.

### Câu 6 — Kéo xuống để làm mới

- Thêm `RefreshControl` vào `FlatList`.
- Dùng state `refreshing` riêng cho thao tác làm mới.
- Trong `finally`, luôn gọi `setRefreshing(false)` để vòng xoay dừng kể cả khi API lỗi.
- Sau khi làm mới, giữ nguyên lựa chọn của hai công tắc.
- Nếu danh sách sau khi lọc không có phim, hiển thị **Không có phim nào để hiển thị.**

## 5. Cấu trúc file tham khảo

```text
MovieWatchlist/
├── App.tsx
└── components/
    └── MovieCard.tsx
```


