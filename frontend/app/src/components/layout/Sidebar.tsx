import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { 
  faUser, 
  faPills, 
  faFileInvoice, 
  faRightFromBracket, 
  faChartBar, 
  faBoxes, 
  faTruck, 
  faFlask, 
  faEye,
  type IconDefinition 
} from "@fortawesome/free-solid-svg-icons";
import { logout } from "../../services/authApi";
// import logo from "../../assets/logo.png";
interface NavLink {
    path: string,
    label: string,
    icon: IconDefinition
}

const Sidebar:React.FC = () => {

  const navLinks: NavLink[] = [
    { path: "/admin/thong-ke", label: "Thống Kê", icon: faChartBar },
    { path: "/admin/khach-hang", label: "Khách hàng", icon: faUser },
    { path: "/admin/thuoc", label: "Thuốc", icon: faPills },
    { path: "/admin/loai-thuoc", label: "Loại Thuốc", icon: faBoxes },
    { path: "/admin/nha-cung-cap", label: "Nhà Cung Cấp", icon: faTruck },
    { path: "/admin/hangsx", label: "Hãng Sản Xuất", icon: faFlask },
    { path: "/admin/hoa-don", label: "Hóa Đơn", icon: faFileInvoice },
    { path: "/admin/theo-doi", label: "Theo dõi", icon: faEye },
    // { path: "/admin/xuat-file", label: "Xuất file", icon: faFileExport },
  ];

    // CSS variable
    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex gap-2 ${isActive ? "active bg-[#0E8DA1] p-5 text-white " : "p-5 hover:bg-[#12B0C2] hover:text-white"}`;

    return (
      <div className="h-screen w-[15vw] bg-gray-100 text-black flex flex-col justify-between">
        <div>
          
          <div className="py-2 px-2">
            {/* <img src={logo} alt="" /> */}
            <p className="text-xl font-bold text-center">Hệ Thống</p>
            <p className="text-xl font-bold text-center">Quản Lý Nhà Thuốc</p>
            
          </div>
          <hr />
          <div className="">
            {navLinks.map(({ path, label, icon }) => (
              <div className="text-xl " key={path}>
                <NavLink
                  to={path}
                  className={getLinkClass}
                >
                  <FontAwesomeIcon icon={icon} className="mr-2 w-5 h-5" />
                  {label}
                </NavLink>
              </div>
            ))}
            <hr />
            <div className="text-xl">
              <button className="p-4 cursor-pointer" onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} /> Đăng xuất</button> 
            </div>
          </div>
        </div>

        <div className="border-t py-2 text-center">© 2025 Pharmacy System</div>
    </div>
  );
}

export default Sidebar;