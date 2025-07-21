import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CanhBaoList from "../../components/layout/CanhBaoList";
import DrugStatusCard from "../../components/layout/DrugStatusCard";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function TheoDoi() {
  return (
    <div className="p-6">
        <h2 className="text-2xl font-bold">
          <FontAwesomeIcon icon={faEye} className="mr-2 w-5 h-5"/>
          Theo dõi hệ thống</h2>
        <div className="grid gap-6 p-6">
            <DrugStatusCard />
            <CanhBaoList />
        </div>
    </div>
  );
}