import DrugStatusCard from "../../components/layout/DrugStatusCard";
import EntityStats from "../../components/layout/EntityStats";
import RevenueLineChart from "../../components/layout/RevenueLineChart";
import TopSellingPieChart from "../../components/layout/TopSellingPieChart";

export default function ThongKe() {
  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto">
        <h2 className="text-2xl font-bold">Thống kê hệ thống</h2>
        <div className="grid gap-6 p-6">
            <EntityStats />
            <DrugStatusCard />
            <RevenueLineChart />
            <TopSellingPieChart />
        </div>
    </div>
  );
}