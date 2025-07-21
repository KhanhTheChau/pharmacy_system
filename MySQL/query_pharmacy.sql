USE pharmacy_db;
SHOW TABLES;
SELECT * FROM users_khachhangmodel;

-- 1. Function – Hàm trả về số lượng thuốc còn lại trong kho của một loại thuốc
DROP FUNCTION IF EXISTS fn_so_luong_ton_kho;

DELIMITER //

CREATE FUNCTION fn_so_luong_ton_kho(ma_thuoc CHAR(32))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE so_luong INT;

    SELECT SoLuongTonKho
    INTO so_luong
    FROM medicine_thuocmodel
    WHERE MaThuoc = ma_thuoc;

    RETURN so_luong;
END //

DELIMITER ;


SELECT fn_so_luong_ton_kho('bc771cd10d2a4adebc39c05ab2a0078a');

-- 2. Trigger – Cảnh báo khi thuốc sắp hết hạn (trước 30 ngày)
CREATE TABLE thuoc_canh_bao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    thuoc_id INT,
    ten_thuoc VARCHAR(255),
    han_su_dung DATE,
    ngay_canh_bao DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS trg_thuoc_sap_het_han;

DELIMITER //

CREATE TRIGGER trg_thuoc_sap_het_han
AFTER INSERT ON medicine_thuocmodel
FOR EACH ROW
BEGIN
    IF DATEDIFF(NEW.HanSuDung, CURDATE()) <= 30 THEN
        INSERT INTO thuoc_canh_bao (thuoc_id, ten_thuoc, han_su_dung)
        VALUES (NEW.MaThuoc, NEW.TenThuoc, NEW.HanSuDung);
    END IF;
END //

DELIMITER ;


-- 3. Stored Procedure – Danh sách thuốc thuộc loại thuốc xác định
DROP PROCEDURE IF EXISTS sp_thuoc_theo_loai;

DELIMITER //

CREATE PROCEDURE sp_thuoc_theo_loai(IN ten_loai VARCHAR(255))
BEGIN
    SELECT 
        T.MaThuoc, 
        T.TenThuoc, 
        T.CongDung, 
        T.SoLuongTonKho, 
        T.HanSuDung
    FROM 
        medicine_thuocmodel T
    JOIN 
        medicine_types_loaithuocmodel L 
    ON 
        T.MaLoai_id = L.MaLoai
    WHERE 
        L.TenLoai LIKE CONCAT('%', ten_loai, '%');
END //

DELIMITER ;
DESCRIBE medicine_types_loaithuocmodel;

CALL sp_thuoc_theo_loai('kháng sinh');

--  4. Thống kê doanh thu theo ngày, tuần, tháng
-- a) Doanh thu theo ngày
SELECT NgayLap, SUM(TongTien) AS DoanhThu
FROM invoice_hoadonmodel
GROUP BY NgayLap
ORDER BY NgayLap DESC;

-- b) Doanh thu theo tuần
SELECT
  YEAR(NgayLap) AS Nam,
  WEEK(NgayLap, 1) AS Tuan,
  SUM(TongTien) AS DoanhThu
FROM invoice_hoadonmodel
GROUP BY YEAR(NgayLap), WEEK(NgayLap, 1)
ORDER BY Nam DESC, Tuan DESC;

-- c) Doanh thu theo tháng
SELECT
  YEAR(NgayLap) AS Nam,
  MONTH(NgayLap) AS Thang,
  SUM(TongTien) AS DoanhThu
FROM invoice_hoadonmodel
GROUP BY YEAR(NgayLap), MONTH(NgayLap)
ORDER BY Nam DESC, Thang DESC;

