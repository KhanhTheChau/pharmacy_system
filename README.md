# HỆ THỐNG QUẢN LÝ NHÀ THUỐC

## Member List

1. Châu Thế Khanh - B2207528 - khanhb2207528@student.ctu.edu.vn
2. Lý Trí Khải - B2207530 - khaib2207530@student.ctu.edu.vn
3. Nguyễn Lê Tấn Thành - B2207565 - thanhb2207565@student.ctu.edu.vn

## Technologies Used:

- Python 3.10
- Django 4.2
- React 5.1

## Additional Python Modules Required:

- django-crispy-forms 2.1
- crispy-bootstrap4 2023.1
- Pillow 10.1.0

## Task: Hệ thống quản lý Nhà thuốc

1. Thuốc (Mã thuốc, Mã loại, Mã hãng SX, Mã nhà cung cấp, Tên Thuốc, Công dụng, Đơn giá, Số lượng tồn kho, Hạn sử dụng)
2. Hãng SX (Mã hãng SX, Tên hãng, Quốc gia)
3. Loại thuốc (Mã loại, Tên loại, Đơn vị tính)
4. Nhà cung cấp (Mã nhà cung cấp, Tên nhà cung cấp, Số điện thoại)
5. Khách hàng (Mã khách hàng, Tên khách hàng, Số điện thoại, Địa chỉ)
6. Hóa đơn (Mã hóa đơn, Mã khách hàng, Ngày lập, Tổng tiền)
7. Chi tiết hóa đơn (Mã chi tiết HĐ, Mã hóa đơn, Mã thuốc, Số lượng bán, Giá bán)

\*Gợi ý tính năng:

- Function: Hàm trả về số lượng thuốc còn lại trong kho của một loại thuốc. 
- Trigger: Tự động thông báo khi thuốc sắp hết hạn (trước 30 ngày)
- Stored Procedure: Danh sách thuốc thuộc một loại thuốc xác định (Ví dụ: Truyền vào tham số loại thuốc là “kháng sinh”, hiển thị danh sách các thuốc có công dụng tương tự)
- Thống kê: Báo cáo doanh thu theo tuần, theo ngày, theo tháng.

\*Nâng cao:
- Phát hiện hóa đơn bất thường