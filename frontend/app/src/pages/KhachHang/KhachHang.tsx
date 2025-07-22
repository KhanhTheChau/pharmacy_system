import React, { useEffect, useState } from "react";
import type { KhachHangFormType, KhachHangType } from "../../types/khachHang";
import DataTable, { type Column } from "../../components/layout/DataTable";
import {
  createKhachHang,
  deleteKhachHang,
  fetchKhachHangs,
  updateKhachHang,
} from "../../services/khachHangApi";
import AddForm from "./AddForm";
import { exportToExcel } from "../../components/utils/exportExcel";
import { exportToJson } from "../../components/utils/exportJson";
import { filterAndSortData } from "../../components/utils/filterAndSortData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const KhachHang: React.FC = () => {
  const [khachHangs, setKhachHangs] = useState<KhachHangType[]>([]);
  const [khachHang, setKhachHang] = useState<KhachHangType | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  // const [searchTerm, setSearchTerm] = useState<string>("");
  const [query, setQuery] = useState("");
  const [searchKey, setSearchKey] =
    useState<keyof KhachHangType>("TenKhachHang");
  const [loading, setLoading] = useState<boolean>(false);

  const columns: Column<KhachHangType>[] = [
    {
      key: "TenKhachHang",
      label: "Tên Khách Hàng",
      sortValue: (row) => row.TenKhachHang.toLowerCase(),
    },
    {
      key: "SoDienThoai",
      label: "Số Điện Thoại",
      sortValue: (row) => row.SoDienThoai,
    },
    {
      key: "DiaChi",
      label: "Địa Chỉ",
      sortValue: (row) => row.DiaChi,
    },
  ];

  // CSS variable
  const buttonClass =
    "bg-[#12B0C2] text-white px-4 py-2 rounded hover:bg-[#0E8DA1] transition";

  // fetc hdanh sách khách hàng
  useEffect(() => {
    const getKhachHangs = async () => {
      setLoading(true);
      try {
        const data = await fetchKhachHangs();
        setKhachHangs(data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };
    getKhachHangs();
  }, []);

  // Thêm khách hàng
  const handleAddKhachHang = async (formData: KhachHangFormType) => {
    try {
      console.log(formData);
      const newKhachHang = await createKhachHang(formData);
      setKhachHangs([...khachHangs, newKhachHang]);
      setIsOpenModal(false);
      alert("Thêm khách hàng thành công!");
    } catch (error: unknown) {
      console.error("Lỗi khi thêm khách hàng:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Đã xảy ra lỗi không xác định.");
      }
    }
  };

  // Cập nhật thông tin khách hàng
  const handleUpdateKhachHang = async () => {
    if (!khachHang) {
      alert("Chưa có dữ liệu cập nhật!");
      return;
    }

    const { MaKhachHang, ...form } = khachHang ?? {};
    try {
      const data = await updateKhachHang(MaKhachHang, form);
      alert(`Đã cập nhật thành công thông tin khách hàng ${data.TenKhachHang}`);

      const dsKhachHang = await fetchKhachHangs();
      setKhachHangs(dsKhachHang);
      setKhachHang(null);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  // Xóa 1 khách hàng với mã khách hàng
  const handleDeleteKhachHang = async () => {
    if (!khachHang) {
      alert("Chưa có dữ liệu cập nhật!");
      return;
    }
    window.confirm(
      `Xác nhận xóa dữ liệu khách hàng "${khachHang.TenKhachHang}"`
    );
    try {
      const message = await deleteKhachHang(khachHang.MaKhachHang);
      console.log(message);
      alert("Đã xóa thành công");

      const dsKhachHang = await fetchKhachHangs();
      setKhachHangs(dsKhachHang);
      setKhachHang(null);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Không thể xóa dữ liệu");
    }
  };

  // Làm mới form
  const handleReset = () => {
    setKhachHang(null);
  };

  // const handleSearch = async () => {
  //   try {
  //     const data = await fetchKhachHangs();
  //     const filteredData = data.filter((kh) =>
  //       kh.TenKhachHang.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //     setKhachHangs(filteredData);
  //   } catch (error) {
  //     console.error("Lỗi khi tìm kiếm:", error);
  //     alert("Không thể tìm kiếm khách hàng!");
  //   }
  // }

  const handleClose = () => {
    setIsOpenModal(false);
  };

  const handleRowClick = (row: KhachHangType) => {
    setKhachHang(row);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setKhachHang((prev) => (prev ? { ...prev, [id]: value } : null));
  };

  // Xuất file excel
  const handleExportExcel = () => {
    const data = khachHangs.map((kh) => ({
      "Mã KH": kh.MaKhachHang,
      "Tên KH": kh.TenKhachHang,
      SĐT: kh.SoDienThoai,
      "Địa chỉ": kh.DiaChi,
    }));

    exportToExcel(data, "danh_sach_khach_hang");
  };

  // Xuất file json
  const handleExportJson = () => {
    exportToJson<KhachHangType>(khachHangs, "khach_hang");
  };

  // Tìm kiếm
  const filterData: KhachHangType[] = filterAndSortData<KhachHangType>(
    khachHangs,
    query,
    searchKey
  );

  const handelCancelSearch = async () => {
    setQuery("");
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <svg
              className="animate-spin h-6 w-6 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
          </div>
        ) : filterData.length === 0 ? (
          <div className="text-center text-gray-500">
            Không tìm thấy khách hàng nào.
          </div>
        ) : (
          <DataTable<KhachHangType>
            data={filterData}
            columns={columns}
            title="Danh sách khách hàng"
            onRowClick={handleRowClick}
            selectedRowId={khachHang?.MaKhachHang}
            rowKey="MaKhachHang"
          />
        )}
      </div>

      <div className="col-span-1 flex flex-col gap-4">
        <div className="p-4 shadow rounded border border-[#ccc]">
          <h3 className="font-semibold mb-4">
            <FontAwesomeIcon icon={faUser} className="mr-2 w-5 h-5" />
            Thông tin khách hàng
          </h3>
          <div className="space-y-4 max-w-md">
            {columns.map((col) => (
              <div
                key={col.key}
                className="grid grid-cols-[120px_1fr] items-center gap-2"
              >
                <label htmlFor={col.key}>{col.label}:</label>
                <input
                  id={col.key}
                  type="text"
                  className="border px-2 py-1 w-full"
                  value={khachHang?.[col.key] ?? ""}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              className={buttonClass}
              onClick={() => setIsOpenModal(true)}
            >
              Thêm khách hàng
            </button>
            <button className={buttonClass} onClick={handleUpdateKhachHang}>
              Lưu
            </button>
            <button className={buttonClass} onClick={handleDeleteKhachHang}>
              Xóa
            </button>
            <button className={buttonClass} onClick={handleReset}>
              Làm mới
            </button>
          </div>
        </div>

        <div className="p-4 shadow border border-[#ccc]">
          <h3 className="font-semibold mb-4">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="mr-2 w-5 h-5"
            />
            Tìm Kiếm Khách Hàng
          </h3>
          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <label className="w-[120px]">Tìm theo:</label>
            <select
              value={searchKey}
              className="border px-2 py-1"
              onChange={(e) =>
                setSearchKey(e.target.value as keyof KhachHangType)
              }
            >
              <option value="TenKhachHang">Tên khách hàng</option>
              <option value="SoDienThoai">Số điện thoại</option>
              <option value="DiaChi">Địa chỉ</option>
            </select>

            <label className="w-[120px]">Từ khóa:</label>
            <input
              type="text"
              className="border px-2 py-1 w-full"
              placeholder={
                searchKey === "TenKhachHang"
                  ? "Nhập tên khách hàng..."
                  : searchKey === "SoDienThoai"
                  ? "Nhập số điện thoại..."
                  : "Nhập địa chỉ khách hàng..."
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button className={buttonClass} onClick={handelCancelSearch}>
              Hủy tìm kiếm
            </button>
          </div>
        </div>

        <div className="p-4 shadow rounded border border-[#ccc]">
          <h3 className="font-semibold mb-4">
            <FontAwesomeIcon icon={faFileExport} className="mr-2 w-5 h-5" />
            Xuất file
          </h3>
          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <label>Xuất file Excel:</label>
            <button onClick={handleExportExcel} className={buttonClass}>
              Export to excel
            </button>

            <label>Xuất file Json:</label>
            <button onClick={handleExportJson} className={buttonClass}>
              Export to json
            </button>
          </div>
        </div>
      </div>

      <div>
        <AddForm<KhachHangFormType>
          title="Thêm khách hàng"
          fields={[
            { name: "TenKhachHang", label: "Tên Khách Hàng", required: true },
            { name: "SoDienThoai", label: "Số Điện Thoại", required: true },
            { name: "DiaChi", label: "Địa Chỉ" },
          ]}
          isOpen={isOpenModal}
          onSubmit={handleAddKhachHang}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default KhachHang;
