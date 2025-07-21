import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import HoaDonPrint, { type HoaDonPrintProps } from "./HoaDonPrint";

const PrintButton: React.FC<HoaDonPrintProps> = ({
  khachHang,
  diaChi,
  items,
  ngayLap,
  sdt,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const buttonClass =
    "bg-[#12B0C2] text-white px-4 py-2 rounded hover:bg-[#0E8DA1] transition";

  const now = new Date();
  const formatted =
    String(now.getDate()).padStart(2, "0") +
    String(now.getMonth() + 1).padStart(2, "0") +
    now.getFullYear() +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0");

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `invoice${formatted}`,
  });

  return (
    <>
      <button
        onClick={handlePrint}
        className={buttonClass}
      >
        In hóa đơn
      </button>

      <div style={{ display: "none" }}>
        <HoaDonPrint
          ref={printRef}
          khachHang={khachHang}
          diaChi={diaChi}
          items={items}
          ngayLap={ngayLap}
          sdt={sdt}
        />
      </div>
    </>
  );
};

export default PrintButton;
