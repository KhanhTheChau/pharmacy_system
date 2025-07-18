import React, { useEffect, useState } from "react";
import type { LoaiThuocFormType, LoaiThuocType } from "../../types/loaiThuoc";
import DataTable, { type Column } from "../../components/layout/DataTable";
import { createLoaiThuoc, deleteLoaiThuoc, fetchLoaiThuocs, updateLoaiThuoc } from "../../services/loaiThuocApi";
import AddForm from "./LoaiThuocForm";
import { filterAndSortData } from "../../components/utils/filterAndSortData";
import { exportToJson } from "../../components/utils/exportJson";
import { exportToExcel } from "../../components/utils/exportExcel";


const LoaiThuoc: React.FC = () => {
    const [loaiThuocs, setLoaiThuocs] = useState<LoaiThuocType[]>([]);
    const [loaiThuoc, setLoaiThuoc] = useState<LoaiThuocType | null>(null);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [query, setQuery] = useState("");
    const [searchKey, setSearchKey] = useState<keyof LoaiThuocType>("TenLoai");
    const [loading, setLoading] = useState<boolean>(false);
  

    const columns: Column<LoaiThuocType>[] = [
      {
        key: 'TenLoai',
        label: 'Tên loại',
        sortValue: (row) => row.TenLoai.toLowerCase(),
      },
      {
        key: 'DonViTinh',
        label: 'Đơn vị tính',
        sortValue: (row) => row.DonViTinh.toLowerCase(),
      },
    ];

    // CSS variable
    const buttonClass = "bg-[#12B0C2] text-white px-4 py-2 rounded hover:bg-[#0E8DA1] transition";

    // fetc hdanh sách loại thuốc
    useEffect(() => {
      const getLoaiThuocs = async () => {
        setLoading(true);
        try {
          const data = await fetchLoaiThuocs();
          setLoaiThuocs(data); 
        } catch (error) {
          console.error('Lỗi khi gọi API:', error);
        } finally {
          setLoading(false);
        }
      };
      getLoaiThuocs();
    }, []);

    // Thêm loại thuốc
    const handleAddLoaiThuoc = async (formData: LoaiThuocFormType) => {
      try {
        console.log(formData)
        const newLoaiThuoc = await createLoaiThuoc(formData);
        setLoaiThuocs([...loaiThuocs, newLoaiThuoc]);
        setIsOpenModal(false);
        alert("Thêm loại thuốc thành công!");
      } catch (error) {
        console.error("Lỗi khi thêm loại thuốc:", error);
        alert("Không thể thêm loại thuốc");
      }
    };

    // Cập nhật thông tin loại thuốc
    const handleUpdateLoaiThuoc = async () => {
      if(!loaiThuoc) {
        alert("Chưa có dữ liệu cập nhật!")
        return;
      }

      const { MaLoai, ...form } = loaiThuoc ?? {};
      try {
        const data = await updateLoaiThuoc(MaLoai, form);
        alert(`Đã cập nhật thành công thông tin loại thuốc ${data.TenLoai}`)

        const dsLoaiThuoc = await fetchLoaiThuocs();
        setLoaiThuocs(dsLoaiThuoc)
        setLoaiThuoc(null)
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    }

    // Xóa 1 loại thuốc với mã loại thuốc
    const handleDeleteLoaiThuoc = async () => {
      if(!loaiThuoc) {
        alert("Chưa có dữ liệu cập nhật!")
        return;
      }
      window.confirm(`Xác nhận xóa dữ liệu loại thuốc "${loaiThuoc.TenLoai}"`);
      try {
        const message = await deleteLoaiThuoc(loaiThuoc.MaLoai);
        console.log(message)
        alert("Đã xóa thành công")

        const dsLoaiThuoc = await fetchLoaiThuocs();
        setLoaiThuocs(dsLoaiThuoc)
        setLoaiThuoc(null)
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        alert("Không thể xóa dữ liệu")
      }
    }

    // Làm mới form
    const handleReset = () => {
      setLoaiThuoc(null)
    }

    const handelCancelSearch = async () => {
      setQuery("")
    }

    const handleClose = () => {
      setIsOpenModal(false);
    };

    const handleRowClick = (row: LoaiThuocType) => {
      setLoaiThuoc(row)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;
      setLoaiThuoc((prev) => prev ? { ...prev, [id]: value } : null);
    };

    const filterData:LoaiThuocType[] = filterAndSortData<LoaiThuocType>(
        loaiThuocs,
        query,
        searchKey
    );

    // Xuất file excel
    const handleExportExcel = () => {
      const data = loaiThuocs.map(lt => ({
        "Mã loại thuốc": lt.MaLoai,
        "Tên loại thuốc": lt.TenLoai,
        "Đơn vị tính": lt.DonViTinh,
      }));
    
      exportToExcel(data, "danh_sach_loai_thuoc");
    };
    
        // Xuất file json
    const handleExportJson = () => {
      exportToJson<LoaiThuocType>(loaiThuocs, "loai_thuoc");
    };
    

    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {loading ? (
              <div className="flex justify-center items-center h-40">
                <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
              </div>
            ) : filterData.length === 0 ? (
              <div className="text-center text-gray-500">Không tìm thấy khách hàng nào.</div>
            ) : (
              <DataTable<LoaiThuocType>
                data={filterData}
                columns={columns}
                title="Danh sách loại thuốc"
                onRowClick={handleRowClick}
                selectedRowId={loaiThuoc?.MaLoai}
                rowKey="MaLoai"
              />
            )}
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <div className="p-4 shadow rounded border border-[#ccc]">
            <h3 className="font-semibold mb-4">Thông tin loại thuốc</h3>


            <div className="space-y-4 max-w-md">
              {columns.map((col) => (
                <div key={col.key} className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <label htmlFor={col.key}>{col.label}:</label>

                  {col.key === "DonViTinh" ? (
                    <select
                      id={col.key}
                      className="border px-2 py-1 w-full"
                      value={loaiThuoc?.[col.key] ?? ""}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Chọn đơn vị --</option>
                      <option value="viên">Viên</option>
                      <option value="lọ">Lọ</option>
                      <option value="ống">Ống</option>
                      <option value="chai">Chai</option>
                      <option value="hộp">Hộp</option>
                      <option value="gói">Gói</option>
                    </select>
                  ) : (
                    <input
                      id={col.key}
                      type="text"
                      className="border px-2 py-1 w-full"
                      value={loaiThuoc?.[col.key] ?? ""}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
              ))}
            </div>


            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className={buttonClass} onClick={() => setIsOpenModal(true)}>
                Thêm loại thuốc
              </button>
              <button className={buttonClass} onClick={handleUpdateLoaiThuoc}>Lưu</button>
              <button className={buttonClass} onClick={handleDeleteLoaiThuoc}>Xóa</button>
              <button className={buttonClass} onClick={handleReset} >Làm mới</button>
            </div>
          </div>

          <div className="p-4 shadow border border-[#ccc]">
            <h3 className="font-semibold mb-4">Tìm kiếm loại thuốc</h3>
              <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                <label className="w-[120px]">Tìm theo:</label>
                  <select
                    value={searchKey}
                    className="border px-2 py-1"
                    onChange={(e) => setSearchKey(e.target.value as keyof LoaiThuocType)}
                  >
                    <option value="TenLoai">Tên loại thuốc</option>
                    <option value="DonViTinh">Đơn vị tính</option>
                  </select>
          
                  <label className="w-[120px]">Từ khóa:</label>
                  <input
                    type="text"
                    className="border px-2 py-1 w-full"
                    placeholder={
                    searchKey === "TenLoai"
                      ? "Nhập tên loại thuốc..."
                      : "Nhập địa đơn vị tính..."
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  </div>
          
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    <button className={buttonClass} onClick={handelCancelSearch}>
                      Hủy tìm kiếm
                    </button>
                  </div>
          </div>

          <div className="p-4 shadow rounded border border-[#ccc]">
            <h3 className="font-semibold mb-4">Xuất file</h3>
              <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                <label>Xuất file Excel:</label>
                <button
                  onClick={handleExportExcel}
                  className={buttonClass}
                >
                  Export to excel
                </button>

                <label>Xuất file Json:</label>
                <button
                  onClick={handleExportJson}
                  className={buttonClass}
                >
                  Export to json
                </button>
              </div>
            </div>
          </div>

        <div>
        <AddForm<LoaiThuocFormType>
          title="Thêm loại thuốc"
          fields={[
            { name: "TenLoai", label: "Tên loại thuốc", required: true },
            {
              name: "DonViTinh",
              label: "Đơn vị tính",
              type: "select",
              required: true,
              options: [
                { value: "viên", label: "Viên" },
                { value: "lọ", label: "Lọ" },
                { value: "ống", label: "Ống" },
                { value: "chai", label: "Chai" },
                { value: "hộp", label: "Hộp" },
                { value: "gói", label: "Gói" },
              ],
            },
          ]}
          isOpen={isOpenModal}
          onSubmit={handleAddLoaiThuoc}
          onClose={handleClose}
        />
        </div>
      </div>
    );
}

export default LoaiThuoc;