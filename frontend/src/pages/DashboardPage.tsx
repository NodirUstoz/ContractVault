/**
 * DashboardPage component.
 * Main landing page after login; shows key metrics and recent contracts.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useContractList } from "../hooks/useContracts";
import DashboardStats, { DashboardData } from "../components/DashboardStats";
import ContractCard from "../components/ContractCard";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [statsLoading, setStatsLoading] = useState(true);

  const { contracts, isLoading: contractsLoading } = useContractList({
    page_size: 6,
    ordering: "-created_at",
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await apiClient.get("/analytics/dashboard/");
        setDashboardData(data);
      } catch {
        // Dashboard analytics may not be configured yet
        setDashboardData(null);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your contract portfolio
          </p>
        </div>
        <button
          onClick={() => navigate("/contracts/new")}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          New Contract
        </button>
      </div>

      {/* Stats cards */}
      <DashboardStats data={dashboardData} isLoading={statsLoading} />

      {/* Recent contracts */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Contracts
          </h2>
          <button
            onClick={() => navigate("/contracts")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        </div>

        {contractsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : contracts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onClick={(id) => navigate(`/contracts/${id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No contracts yet.</p>
            <button
              onClick={() => navigate("/contracts/new")}
              className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              Create Your First Contract
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
