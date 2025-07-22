import React, { useEffect, useState } from "react";
import type {
  NhaCungCapFormType,
  NhaCungCapType,
} from "../../types/nhaCungCap";
import DataTable, { type Column } from "../../components/layout/DataTable";
import {
  createNhaCungCap,
  deleteNhaCungCap,
  fetchNhaCungCaps,
  updateNhaCungCap,
} from "../../services/nhaCungCapApi";
import NCCForm from "./NhaCCForm";
import { exportToExcel } from "../../components/utils/exportExcel";
import { exportToJson } from "../../components/utils/exportJson";
import { filterAndSortData } from "../../components/utils/filterAndSortData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faMagnifyingGlass,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";

const NhaCungCap: React.FC = () => {
  const [nhaCungCaps, setNhaCungCaps] = useState<NhaCungCapType[]>([]);
  const [nhaCungCap, setNhaCungCap] = useState<NhaCungCapType | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [searchKey, setSearchKey] = useState<keyof NhaCungCapType>("TenNCC");
  const [loading, setLoading] = useState<boolean>(false);

  const columns: Column<NhaCungCapType>[] = [
    {
      key: "TenNCC",
      label: "Tên nhà cung cấp",
      sortValue: (row) => row.TenNCC.toLowerCase(),
    },
    {
      key: "SoDienThoai",
      label: "Số Điện Thoại",
      sortValue: (row) => row.SoDienThoai,
    },
  ];

  // CSS variable
  const buttonClass =
    "bg-[#12B0C2] text-white px-4 py-2 rounded hover:bg-[#0E8DA1] transition";

  // fetc hdanh sách nhà cung cấp
  useEffect(() => {
    const getNhaCungCaps = async () => {
      setLoading(true);
      try {
        const data = await fetchNhaCungCaps();
        setNhaCungCaps(data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };
    getNhaCungCaps();
  }, []);

  // Thêm nhà cung cấp
  const handleAddNhaCungCap = async (formData: NhaCungCapFormType) => {
    try {
      console.log(formData);
      const newNhaCungCap = await createNhaCungCap(formData);
      setNhaCungCaps([...nhaCungCaps, newNhaCungCap]);
      setIsOpenModal(false);
      alert("Thêm nhà cung cấp thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm nhà cung cấp:", error);
      alert("Không thể thêm nhà cung cấp");
    }
  };

  // Cập nhật thông tin nhà cung cấp
  const handleUpdateNhaCungCap = async () => {
    if (!nhaCungCap) {
      alert("Chưa có dữ liệu cập nhật!");
      return;
    }

    const { MaNCC, ...form } = nhaCungCap ?? {};
    try {
      const data = await updateNhaCungCap(MaNCC, form);
      alert(`Đã cập nhật thành công thông tin nhà cung cấp ${data.TenNCC}`);

      const dsNhaCungCap = await fetchNhaCungCaps();
      setNhaCungCaps(dsNhaCungCap);
      setNhaCungCap(null);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  // Xóa 1 nhà cung cấp với mã nhà cung cấp
  const handleDeleteNhaCungCap = async () => {
    if (!nhaCungCap) {
      alert("Chưa có dữ liệu cập nhật!");
      return;
    }
    // window.confirm(`Xác nhận xóa dữ liệu nhà cung cấp "${nhaCungCap.TenNCC}"`);
    if (
      !window.confirm(
        `Xác nhận xóa dữ liệu nhà cung cấp "${nhaCungCap.TenNCC}"?`
      )
    )
      return;

    try {
      const message = await deleteNhaCungCap(nhaCungCap.MaNCC);
      console.log(message);
      alert("Đã xóa thành công");

      const dsNhaCungCap = await fetchNhaCungCaps();
      setNhaCungCaps(dsNhaCungCap);
      setNhaCungCap(null);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Không thể xóa dữ liệu");
    }
  };

  // Làm mới form
  const handleReset = () => {
    setNhaCungCap(null);
  };

  const handleClose = () => {
    setIsOpenModal(false);
  };

  const handleRowClick = (row: NhaCungCapType) => {
    setNhaCungCap(row);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNhaCungCap((prev) => (prev ? { ...prev, [id]: value } : null));
  };

  const handleExportExcel = () => {
    const data = nhaCungCaps.map((ncc) => ({
      "Mã nhà cung cấp": ncc.MaNCC,
      "Tên nhà cung cấp": ncc.TenNCC,
      "Số điện thoại": ncc.SoDienThoai,
    }));

    exportToExcel(data, "danh_sach_nha_cung_cap");
  };

  const handleExportJson = () => {
    exportToJson<NhaCungCapType>(nhaCungCaps, "nha_cung_cap");
  };

  const filterData: NhaCungCapType[] = filterAndSortData<NhaCungCapType>(
    nhaCungCaps,
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
          <DataTable<NhaCungCapType>
            data={filterData}
            columns={columns}
            title="Danh sách nhà cung cấp"
            onRowClick={handleRowClick}
            selectedRowId={nhaCungCap?.MaNCC}
            rowKey="MaNCC"
          />
        )}
      </div>

      <div className="col-span-1 flex flex-col gap-4">
        <div className="p-4 shadow rounded border border-[#ccc]">
          <h3 className="font-semibold mb-4">
            {" "}
            <FontAwesomeIcon icon={faTruck} className="mr-2 w-5 h-5" />
            Thông tin nhà cung cấp
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
                  value={nhaCungCap?.[col.key] ?? ""}
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
              Thêm nhà cung cấp
            </button>
            <button className={buttonClass} onClick={handleUpdateNhaCungCap}>
              Lưu
            </button>
            <button className={buttonClass} onClick={handleDeleteNhaCungCap}>
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
            Tìm kiếm nhà cung cấp
          </h3>
          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <label className="w-[120px]">Tìm theo:</label>
            <select
              value={searchKey}
              className="border px-2 py-1"
              onChange={(e) =>
                setSearchKey(e.target.value as keyof NhaCungCapType)
              }
            >
              <option value="TenNCC">Tên nhà cung cấp</option>
              <option value="SoDienThoai">Số điện thoại</option>
            </select>

            <label className="w-[120px]">Từ khóa:</label>
            <input
              type="text"
              className="border px-2 py-1 w-full"
              placeholder={
                searchKey === "TenNCC"
                  ? "Nhập tên nhà cung cấp..."
                  : "Nhập số điện thoại..."
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
            {" "}
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
        <NCCForm<NhaCungCapFormType>
          title="Thêm nhà cung cấp"
          fields={[
            { name: "TenNCC", label: "Tên nhà cung cấp", required: true },
            { name: "SoDienThoai", label: "Số Điện Thoại", required: true },
          ]}
          isOpen={isOpenModal}
          onSubmit={handleAddNhaCungCap}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default NhaCungCap;
