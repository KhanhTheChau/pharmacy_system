import React, { useEffect, useState, type ReactNode } from "react";
import DataTable, { type Column } from "../../components/layout/DataTable";
import type {
  ThuocFormType,
  ThuocSearchKey,
  ThuocType,
} from "../../types/thuoc";
import {
  createThuoc,
  deleteThuoc,
  fetchThuocs,
  updateThuoc,
} from "../../services/thuocApi";
import type { NhaCungCapType } from "../../types/nhaCungCap";
import type { HangSXType } from "../../types/hangSX";
import type { LoaiThuocType } from "../../types/loaiThuoc";
import { fetchHangSXs } from "../../services/hangSXApi";
import { fetchNhaCungCaps } from "../../services/nhaCungCapApi";
import { fetchLoaiThuocs } from "../../services/loaiThuocApi";
import ThuocForm from "./ThuocForm";
import { formatCurrency } from "../../types/utils";
// import { exportToExcel } from "../../components/utils/exportExcel";
import { exportToJson } from "../../components/utils/exportJson";
import {
  filterAndSortByNestedKey,
  getValueByPath,
} from "../../components/utils/filterAndSortData";
import { exportToExcel } from "../../components/utils/exportExcel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCapsules,
  faFileExport,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const Thuoc: React.FC = () => {
  const [thuocs, setThuocs] = useState<ThuocType[]>([]);
  const [thuoc, setThuoc] = useState<ThuocType | null>(null);
  const [nhaCungCaps, setNhaCungCaps] = useState<NhaCungCapType[]>([]);
  const [hangSXs, setHangSXs] = useState<HangSXType[]>([]);
  const [loais, setLoais] = useState<LoaiThuocType[]>([]);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [searchKey, setSearchKey] = useState<ThuocSearchKey>("TenThuoc");
  const [loading, setLoading] = useState<boolean>(false);

  const columns: Column<ThuocType>[] = [
    {
      key: "TenThuoc",
      label: "Tên thuốc",
      sortValue: (row) => row.TenThuoc.toLowerCase(),
    },
    {
      key: "CongDung",
      label: "Công dụng",
      sortValue: (row) => row.CongDung?.toLowerCase() ?? "",
    },
    {
      key: "DonGia",
      label: "Đơn giá",
      sortValue: (row) => row.DonGia,
      render: (_, record) => formatCurrency(record.DonGia),
    },
    {
      key: "SoLuongTonKho",
      label: "Số lượng kho",
      sortValue: (row) => row.SoLuongTonKho,
      render: (_, record) => record.SoLuongTonKho.toString(),
    },
    {
      key: "HanSuDung",
      label: "Hạn sử dụng",
      sortValue: (row) =>
        row.HanSuDung ? new Date(row.HanSuDung).getTime() : 0,
      render: (_, record) =>
        record.HanSuDung
          ? new Date(record.HanSuDung).toLocaleDateString("vi-VN")
          : "Không có",
    },
    {
      key: "HangSX",
      label: "Hãng sản xuất",
      sortValue: (row) => row.HangSX?.TenHangSX?.toLowerCase() ?? "",
      render: (_, record) => record.HangSX?.TenHangSX ?? "N/A",
    },
    {
      key: "NhaCungCap",
      label: "Nhà cung cấp",
      sortValue: (row) => row.NhaCungCap?.TenNCC?.toLowerCase() ?? "",
      render: (_, record) => record.NhaCungCap?.TenNCC ?? "N/A",
    },
    {
      key: "Loai",
      label: "Loại thuốc",
      sortValue: (row) => row.Loai?.TenLoai?.toLowerCase() ?? "",
      render: (_, record) => record.Loai?.TenLoai ?? "N/A",
    },
  ];

  const title = "Danh sách thuốc";

  const buttonClass =
    "bg-[#12B0C2] text-white px-4 py-2 rounded hover:bg-[#0E8DA1] transition";

  useEffect(() => {
    const getThuocs = async () => {
      setLoading(true);
      try {
        const data = await fetchThuocs();
        const dataHangSX = await fetchHangSXs();
        const dataNCC = await fetchNhaCungCaps();
        const dataLoai = await fetchLoaiThuocs();
        setThuocs(data);
        setNhaCungCaps(dataNCC);
        setHangSXs(dataHangSX);
        setLoais(dataLoai);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };
    getThuocs();
  }, []);

  const handleAdd = async (formData: ThuocFormType) => {
    console.log(formData);
    try {
      console.log(formData);
      const newThuoc = await createThuoc(formData);
      setThuocs([...thuocs, newThuoc]);
      setIsOpenModal(false);
      alert(`Thêm thành công thuốc ${newThuoc.TenThuoc}!`);
    } catch (error) {
      console.error("Lỗi khi thêm thuốc:", error);
      alert("Không thể thêm thuốc");
    }
  };

  const handleUpdate = async () => {
    if (!thuoc) {
      alert("Chưa có dữ liệu cập nhật!");
      return;
    }

    const {
      MaThuoc,
      Loai: { MaLoai },
      HangSX: { MaHangSX },
      NhaCungCap: { MaNCC },
      TenThuoc,
      CongDung = "",
      DonGia,
      SoLuongTonKho,
      HanSuDung,
    } = thuoc ?? {};

    const form: ThuocFormType = {
      MaLoai,
      MaHangSX,
      MaNCC,
      TenThuoc,
      CongDung,
      DonGia,
      SoLuongTonKho,
      HanSuDung,
    };

    try {
      const data = await updateThuoc(MaThuoc, form);
      alert(`Đã cập nhật thành công thông tin thuốc ${data.TenThuoc}`);

      const dsThuoc = await fetchThuocs();
      setThuocs(dsThuoc);
      setThuoc(null);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const handleDelete = async () => {
    if (!thuoc) {
      alert("Chưa có dữ liệu cập nhật!");
      return;
    }
    // window.confirm(`Xác nhận xóa dữ liệu thuốc "${thuoc.TenThuoc}"`);
    const confirm = window.confirm(
      `Xác nhận xóa dữ liệu thuốc "${thuoc.TenThuoc}"`
    );
    if (!confirm) return;

    try {
      const message = await deleteThuoc(thuoc.MaThuoc);
      console.log(message);
      alert("Đã xóa thành công");

      const dsThuoc = await fetchThuocs();
      setThuocs(dsThuoc);
      setThuoc(null);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Không thể xóa dữ liệu");
    }
  };

  const handleReset = () => {
    setThuoc(null);
  };

  const handleClose = () => {
    setIsOpenModal(false);
  };

  const handleRowClick = (row: ThuocType) => {
    setThuoc(row);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    key: string
  ) => {
    const { value } = e.target;

    setThuoc((prev) => {
      const thuoc: ThuocType = prev ?? {
        MaThuoc: "",
        TenThuoc: "",
        CongDung: "",
        DonGia: 0,
        SoLuongTonKho: 0,
        HanSuDung: null,
        Loai: { MaLoai: "", TenLoai: "", DonViTinh: "" },
        HangSX: { MaHangSX: "", TenHangSX: "", QuocGia: "" },
        NhaCungCap: { MaNCC: "", TenNCC: "", SoDienThoai: "" },
      };

      switch (key) {
        case "HangSX": {
          const selectedHangSX = hangSXs.find((hsx) => hsx.MaHangSX === value);
          return {
            ...thuoc,
            HangSX: {
              MaHangSX: value,
              TenHangSX: selectedHangSX?.TenHangSX ?? "",
              QuocGia: selectedHangSX?.QuocGia ?? "",
            },
          };
        }

        case "NhaCungCap": {
          const selectedNCC = nhaCungCaps.find((ncc) => ncc.MaNCC === value);
          return {
            ...thuoc,
            NhaCungCap: {
              MaNCC: value,
              TenNCC: selectedNCC?.TenNCC ?? "",
              SoDienThoai: selectedNCC?.SoDienThoai ?? "",
            },
          };
        }

        case "Loai": {
          const selectedLoai = loais.find((loai) => loai.MaLoai === value);
          return {
            ...thuoc,
            Loai: {
              MaLoai: value,
              TenLoai: selectedLoai?.TenLoai ?? "",
              DonViTinh: selectedLoai?.DonViTinh ?? "",
            },
          };
        }

        case "SoLuongTonKho":
          return {
            ...thuoc,
            SoLuongTonKho: Math.max(0, Number(value)),
          };

        case "DonGia":
          return {
            ...thuoc,
            DonGia: Number(value.replace(/[^0-9.]/g, "")) || 0,
          };

        case "HanSuDung": {
          const date = new Date(value);
          if (isNaN(date.getTime())) return thuoc;
          return {
            ...thuoc,
            HanSuDung: date,
          };
        }

        default:
          return {
            ...thuoc,
            [key]: value,
          };
      }
    });
  };

  const renderInput = (obj: ThuocType | null, key: string): ReactNode => {
    if (!obj)
      return (
        <input
          id={key}
          type="number"
          className="border px-2 py-1 w-full"
          placeholder="Chọn thuốc để hiển thị..."
          onChange={() => alert("Vui lòng chọn thuốc để hiển thị!")}
          value=""
        />
      );

    switch (key) {
      case "TenThuoc": {
        return (
          <input
            id={key}
            type="text"
            className="border px-2 py-1 w-full"
            value={String(obj[key] ?? "")}
            onChange={(e) => handleInputChange(e, key)}
          />
        );
      }

      case "CongDung": {
        return (
          <textarea
            id={key}
            className="border px-2 py-1 w-full"
            value={String(obj.CongDung ?? "")}
            onChange={(e) => handleInputChange(e, key)}
          />
        );
      }

      case "DonGia":
      case "SoLuongTonKho": {
        return (
          <input
            id={key}
            type="number"
            className="border px-2 py-1 w-full"
            value={obj[key] ?? 0}
            onChange={(e) => handleInputChange(e, key)}
          />
        );
      }

      case "HanSuDung": {
        let dateValue = "";

        if (obj.HanSuDung instanceof Date) {
          dateValue = obj.HanSuDung.toISOString().split("T")[0];
        } else if (typeof obj.HanSuDung === "string") {
          // Đảm bảo chuỗi có định dạng hợp lệ YYYY-MM-DD
          const parsedDate = new Date(obj.HanSuDung);
          if (!isNaN(parsedDate.getTime())) {
            dateValue = parsedDate.toISOString().split("T")[0];
          }
        }

        return (
          <input
            id={key}
            type="date"
            className="border px-2 py-1 w-full"
            value={dateValue}
            onChange={(e) => handleInputChange(e, key)}
          />
        );
      }

      case "HangSX": {
        return (
          <select
            id={key}
            className="border px-2 py-1 w-full"
            value={obj.HangSX?.MaHangSX ?? ""}
            onChange={(e) => handleInputChange(e, key)}
          >
            {hangSXs.map((hsx) => (
              <option key={hsx.MaHangSX} value={hsx.MaHangSX}>
                {hsx.TenHangSX}
              </option>
            ))}
          </select>
        );
      }

      case "NhaCungCap": {
        return (
          <select
            id={key}
            className="border px-2 py-1 w-full"
            value={obj.NhaCungCap?.MaNCC ?? ""}
            onChange={(e) => handleInputChange(e, key)}
          >
            {nhaCungCaps.map((ncc) => (
              <option key={ncc.MaNCC} value={ncc.MaNCC}>
                {ncc.TenNCC}
              </option>
            ))}
          </select>
        );
      }

      case "Loai": {
        return (
          <select
            id={key}
            className="border px-2 py-1 w-full"
            value={obj.Loai?.MaLoai ?? ""}
            onChange={(e) => handleInputChange(e, key)}
          >
            {loais.map((loai) => (
              <option key={loai.MaLoai} value={loai.MaLoai}>
                {loai.TenLoai}
              </option>
            ))}
          </select>
        );
      }

      default: {
        return <div>Không hỗ trợ trường này</div>;
      }
    }
  };

  const handleExportExcel = () => {
    const data = thuocs.map((thuoc) => ({
      "Mã thuốc": thuoc.MaThuoc,
      "Tên thuốc": thuoc.TenThuoc,
      "Công dụng": thuoc.CongDung,
      "Đơn giá (VND)": thuoc.DonGia,
      "Số lượng tồn kho": thuoc.SoLuongTonKho,
      "Hạn sử dụng": thuoc.HanSuDung
        ? new Date(thuoc.HanSuDung).toLocaleDateString("vi-VN")
        : "",

      // Loại thuốc
      "Mã loại": thuoc.Loai?.MaLoai ?? "",
      "Loại thuốc": thuoc.Loai?.TenLoai ?? "",
      "Đơn vị tính": thuoc.Loai?.DonViTinh ?? "",

      // Hãng sản xuất
      "Mã hãng sản xuất": thuoc.HangSX?.MaHangSX ?? "",
      "Hãng sản xuất": thuoc.HangSX?.TenHangSX ?? "",
      "Quốc gia sản xuất": thuoc.HangSX?.QuocGia ?? "",

      // Nhà cung cấp
      "Mã nhà cung cấp": thuoc.NhaCungCap?.MaNCC ?? "",
      "Nhà cung cấp": thuoc.NhaCungCap?.TenNCC ?? "",
      "SĐT NCC": thuoc.NhaCungCap?.SoDienThoai ?? "",
    }));

    exportToExcel(data, "danh_sach_thuoc");
  };

  const handleExportJson = () => {
    exportToJson<ThuocType>(thuocs, "thuoc");
  };

  const filterData = filterAndSortByNestedKey(
    thuocs,
    query,
    searchKey,
    undefined,
    (thuoc, key) => {
      const val = getValueByPath(thuoc, key);

      if (key === "DonGia" && typeof val === "number") {
        const raw = val.toString();
        const formatted = formatCurrency(val).replace(/[^\d]/g, "");
        return `${raw} ${formatted}`;
      }

      if (key === "HanSuDung" && val instanceof Date) {
        return val.toISOString().split("T")[0];
      }

      return val?.toString() ?? "";
    }
  );

  const handelCancelSearch = async () => {
    setQuery("");
  };

  const searchOptions: { label: string; value: ThuocSearchKey }[] = [
    { label: "Tên thuốc", value: "TenThuoc" },
    { label: "Tên loại thuốc", value: "Loai.TenLoai" },
    { label: "Công dụng", value: "CongDung" },
    { label: "Đơn giá", value: "DonGia" },
    { label: "Số lượng kho", value: "SoLuongTonKho" },
    { label: "Hạn sử dụng", value: "HanSuDung" },
    { label: "Tên hãng sản xuất", value: "HangSX.TenHangSX" },
    { label: "Tên nhà cung cấp", value: "NhaCungCap.TenNCC" },
  ];

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
          <DataTable<ThuocType>
            data={filterData}
            columns={columns}
            title={title}
            onRowClick={handleRowClick}
            selectedRowId={thuoc?.MaThuoc}
            rowKey="MaThuoc"
          />
        )}
      </div>

      <div className="col-span-1 flex flex-col gap-4 overflow-y-auto p-2 max-h-[calc(100vh-64px)]">
        <div className="p-4 shadow rounded border border-[#ccc]">
          <h3 className="font-semibold mb-4">
            <FontAwesomeIcon icon={faCapsules} className="mr-2 w-5 h-5" />
            Thông tin thuốc
          </h3>

          <div className="space-y-4 max-w-md">
            {columns.map((col) => (
              <div
                key={col.key}
                className="grid grid-cols-[120px_1fr] items-center gap-2"
              >
                <label htmlFor={col.key}>{col.label}:</label>
                {renderInput(thuoc, col.key)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              className={buttonClass}
              onClick={() => setIsOpenModal(true)}
            >
              Thêm Thuốc
            </button>
            <button className={buttonClass} onClick={handleUpdate}>
              Lưu
            </button>
            <button className={buttonClass} onClick={handleDelete}>
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
            Tìm kiếm thuốc
          </h3>

          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <label className="w-[120px]">Tìm theo:</label>
            <select
              value={searchKey}
              className="border px-2 py-1"
              onChange={(e) => setSearchKey(e.target.value as ThuocSearchKey)}
            >
              {searchOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <label className="w-[120px]">Từ khóa:</label>
            {searchKey === "HanSuDung" ? (
              <input
                type="date"
                className="border px-2 py-1 w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            ) : (
              <input
                type="text"
                className="border px-2 py-1 w-full"
                placeholder={`Nhập ${
                  searchKey === "TenThuoc"
                    ? "tên thuốc"
                    : searchKey === "Loai.TenLoai"
                    ? "tên loại thuốc"
                    : searchKey === "CongDung"
                    ? "công dụng"
                    : searchKey === "DonGia"
                    ? "đơn giá"
                    : searchKey === "SoLuongTonKho"
                    ? "số lượng"
                    : searchKey === "HangSX.TenHangSX"
                    ? "hãng sản xuất"
                    : searchKey === "NhaCungCap.TenNCC"
                    ? "nhà cung cấp"
                    : "từ khóa"
                }...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            )}
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
        <ThuocForm
          title="Thêm thuốc mới"
          isOpen={isOpenModal}
          onSubmit={handleAdd}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default Thuoc;
