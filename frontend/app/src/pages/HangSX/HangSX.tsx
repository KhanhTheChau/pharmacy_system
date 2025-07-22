import React, { useEffect, useState } from "react";
import type { HangSXFormType, HangSXType } from "../../types/hangSX";
import DataTable, { type Column } from "../../components/layout/DataTable";
import {
  createHangSX,
  deleteHangSX,
  fetchHangSXs,
  updateHangSX,
} from "../../services/hangSXApi";
import AddForm from "./AddForm";
import { filterAndSortData } from "../../components/utils/filterAndSortData";
import { exportToJson } from "../../components/utils/exportJson";
import { exportToExcel } from "../../components/utils/exportExcel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faFlask,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const HangSX: React.FC = () => {
  const [HangSXs, setHangSXs] = useState<HangSXType[]>([]);
  const [HangSX, setHangSX] = useState<HangSXType | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [searchKey, setSearchKey] = useState<keyof HangSXType>("TenHangSX");
  const [loading, setLoading] = useState<boolean>(false);

  const columns: Column<HangSXType>[] = [
    {
      key: "TenHangSX",
      label: "Tên Hãng Sãn Xuất",
      sortValue: (row) => row.TenHangSX.toLowerCase(),
    },
    {
      key: "QuocGia",
      label: "Quốc Gia",
      sortValue: (row) => row.QuocGia.toLowerCase(),
    },
  ];

  // CSS variable
  const buttonClass =
    "bg-[#12B0C2] text-white px-4 py-2 rounded hover:bg-[#0E8DA1] transition";

  useEffect(() => {
    const getHangSXs = async () => {
      setLoading(true);
      try {
        const data = await fetchHangSXs();
        setHangSXs(data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };
    getHangSXs();
  }, []);

  const handleAddHangSX = async (formData: HangSXFormType) => {
    try {
      console.log(formData);
      const newHangSX = await createHangSX(formData);
      setHangSXs([...HangSXs, newHangSX]);
      setIsOpenModal(false);
      alert("Thêm hãng sản xuất thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm hãng sản xuất:", error);
      alert("Không thể thêm hãng sản xuất");
    }
  };

  const handleUpdateHangSX = async () => {
    if (!HangSX) {
      alert("Chưa có dữ liệu cập nhật!");
      return;
    }

    const { MaHangSX, ...form } = HangSX ?? {};
    try {
      const data = await updateHangSX(MaHangSX, form);
      alert(`Đã cập nhật thành công thông tin hãng sản xuất ${data.TenHangSX}`);

      const dsHangSX = await fetchHangSXs();
      setHangSXs(dsHangSX);
      setHangSX(null);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const handleDeleteHangSX = async () => {
    if (!HangSX) {
      alert("Chưa có dữ liệu cập nhật!");
      return;
    }
    window.confirm(`Xác nhận xóa dữ liệu hãng sản xuất "${HangSX.TenHangSX}"`);
    try {
      const message = await deleteHangSX(HangSX.MaHangSX);
      console.log(message);
      alert("Đã xóa thành công");

      const dsHangSX = await fetchHangSXs();
      setHangSXs(dsHangSX);
      setHangSX(null);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Không thể xóa dữ liệu");
    }
  };

  const handleReset = () => {
    setHangSX(null);
  };

  const handleClose = () => {
    setIsOpenModal(false);
  };

  const handleRowClick = (row: HangSXType) => {
    setHangSX(row);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setHangSX((prev) => (prev ? { ...prev, [id]: value } : null));
  };

  const handleExportExcel = () => {
    const data = HangSXs.map((hsx) => ({
      "Mã hãng sản xuất": hsx.MaHangSX,
      "Tên hãng sản xuất": hsx.TenHangSX,
      "Quốc gia": hsx.QuocGia,
    }));

    exportToExcel(data, "danh_sach_hang_san_xuat");
  };

  const handleExportJson = () => {
    exportToJson<HangSXType>(HangSXs, "hang_san_xuat");
  };

  const filterData: HangSXType[] = filterAndSortData<HangSXType>(
    HangSXs,
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
          <DataTable<HangSXType>
            data={filterData}
            columns={columns}
            title="Danh sách hãng sản xuất"
            onRowClick={handleRowClick}
            selectedRowId={HangSX?.MaHangSX}
            rowKey="MaHangSX"
          />
        )}
      </div>

      <div className="col-span-1 flex flex-col gap-4">
        <div className="p-4 shadow rounded border border-[#ccc]">
          <h3 className="font-semibold mb-4">
            <FontAwesomeIcon icon={faFlask} className="mr-2 w-5 h-5" />
            Thông tin hãng sản xuất
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
                  value={HangSX?.[col.key] ?? ""}
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
              Thêm hãng sản xuất
            </button>
            <button className={buttonClass} onClick={handleUpdateHangSX}>
              Lưu
            </button>
            <button className={buttonClass} onClick={handleDeleteHangSX}>
              Xóa
            </button>
            <button className={buttonClass} onClick={handleReset}>
              Làm mới
            </button>
          </div>
        </div>

        <div className="p-4 shadow border border-[#ccc]">
          <h3 className="font-semibold mb-4">
            {" "}
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="mr-2 w-5 h-5"
            />
            Tìm kiếm hãng sản xuất
          </h3>
          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <label className="w-[120px]">Tìm theo:</label>
            <select
              value={searchKey}
              className="border px-2 py-1"
              onChange={(e) => setSearchKey(e.target.value as keyof HangSXType)}
            >
              <option value="TenHangSX">Tên hãng sản xuất</option>
              <option value="QuocGia">Quốc gia</option>
            </select>

            <label className="w-[120px]">Từ khóa:</label>
            <input
              type="text"
              className="border px-2 py-1 w-full"
              placeholder={
                searchKey === "TenHangSX"
                  ? "Nhập tên hãng sản xuất..."
                  : "Nhập quốc gia..."
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
        <AddForm<HangSXFormType>
          title="Thêm hãng sản xuất"
          fields={[
            { name: "TenHangSX", label: "Tên Hãng Sãn Xuất", required: true },
            { name: "QuocGia", label: "Quốc gia", required: true },
          ]}
          isOpen={isOpenModal}
          onSubmit={handleAddHangSX}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default HangSX;
