USE pharmacy_db;
SHOW TABLES;
SELECT * FROM medicine_thuocmodel;
SELECT * FROM invoice_hoadonmodel;

-- 1. Khi xóa 1 thuốc bất kỳ khỏi bảng Thuoc, các hóa đơn chứa thuốc đó không còn hiển thị thuốc tương ứng → dẫn đến thất thoát thông tin và sai lệch số tiền.

-- KHÔNG bao giờ xóa thuốc khỏi bảng Thuoc → dùng cờ "đã xóa"
ALTER TABLE medicine_thuocmodel ADD DaXoa BOOLEAN DEFAULT FALSE;

-- Khi cần "xóa" thuốc, chỉ cập nhật:
UPDATE medicine_thuocmodel SET DaXoa = TRUE WHERE MaThuoc = '0ae85bc725524386b40d33e41e771150';

-- Các nơi hiển thị thuốc (như thêm vào hóa đơn) chỉ lọc thuốc còn hoạt động:
SELECT * FROM medicine_thuocmodel WHERE DaXoa = FALSE;
