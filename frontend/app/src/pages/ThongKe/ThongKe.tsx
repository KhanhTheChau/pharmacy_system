import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import EntityStats from "../../components/layout/EntityStats";
import RevenueLineChart from "../../components/layout/RevenueLineChart";
import TopSellingPieChart from "../../components/layout/TopSellingPieChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InvoiceStatisticsByDate from "../../components/layout/InvoiceStatisticsByDate";

export default function ThongKe() {
  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto">
        <h2 className="text-2xl font-bold">
          <FontAwesomeIcon icon={faChartBar} className="mr-2 w-5 h-5" />
          Thống kê hệ thống
          
        </h2>
        <div className="grid gap-6 p-6">
            <EntityStats />
            {/* <DrugStatusCard /> */}
            <RevenueLineChart />
            <TopSellingPieChart />
            <InvoiceStatisticsByDate />
        </div>
    </div>
  );
}