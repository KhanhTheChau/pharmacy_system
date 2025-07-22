import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { fetchSoonExpiringDrugs } from "../../services/thongKeApi";
import { toast } from "react-toastify";

const MainLayout: React.FC = () => {

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) return;
    const fetchData = async () => {
      try {
        const drugs = await fetchSoonExpiringDrugs();
        console.log(drugs)
        if (drugs.length > 0) {
          toast.warning(`Có ${drugs.length} thuốc sắp hết hạn!`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } catch (err) {
        console.error("Không thể kiểm tra thuốc hết hạn.", err);
      } finally {
        setChecked(true);
      }
    };

    fetchData();
  }, [checked]);

  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      <div className="flex-1 container mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
