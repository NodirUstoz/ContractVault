/**
 * ContractListPage component.
 * Full contract listing with filters, search, sorting, and pagination.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useContractList } from "../hooks/useContracts";
import ContractCard from "../components/ContractCard";
import ContractFilters from "../components/ContractFilters";
import ContractStatusBadge from "../components/ContractStatusBadge";
import { formatDate, formatCurrency } from "../utils/formatters";

const ContractListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    contracts,
    totalCount,
    currentPage,
    totalPages,
    isLoading,
    error,
    changePage,
    changeFilters,
  } = useContractList();

  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalCount} contract{totalCount !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 text-sm ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-500"}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 text-sm ${viewMode === "table" ? "bg-blue-50 text-blue-600" : "text-gray-500"}`}
            >
              Table
            </button>
          </div>
          <button
            onClick={() => navigate("/contracts/new")}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            New Contract
          </button>
        </div>
      </div>

      {/* Filters */}
      <ContractFilters onFilterChange={changeFilters} />

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="text-gray-500">Loading contracts...</div>
        </div>
      ) : contracts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg">No contracts match your filters.</p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid view */
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
        /* Table view */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contracts.map((contract) => (
                <tr
                  key={contract.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/contracts/${contract.id}`)}
                >
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-500 font-mono">
                      {contract.contract_number}
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {contract.title}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <ContractStatusBadge status={contract.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {contract.contract_type_name || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatCurrency(contract.total_value, contract.currency)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(contract.expiration_date)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(contract.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractListPage;
