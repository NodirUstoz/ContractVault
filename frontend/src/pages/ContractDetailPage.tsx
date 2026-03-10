/**
 * ContractDetailPage component.
 * Displays full contract information, parties, clauses, and lifecycle actions.
 */
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContractDetail } from "../hooks/useContracts";
import ContractStatusBadge from "../components/ContractStatusBadge";
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  getPriorityLabel,
} from "../utils/formatters";

const ContractDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    contract,
    isLoading,
    error,
    transitionStatus,
    downloadPdf,
    duplicateContract,
    deleteContract,
  } = useContractDetail(id);

  const [activeTab, setActiveTab] = useState<
    "overview" | "parties" | "clauses" | "history"
  >("overview");

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!contract) return null;

  const ALLOWED_TRANSITIONS: Record<string, string[]> = {
    draft: ["pending_approval", "archived"],
    pending_approval: ["draft"],
    approved: ["pending_signature", "active"],
    rejected: ["draft"],
    pending_signature: ["active"],
    active: ["terminated", "archived"],
    expired: ["renewed", "archived"],
    terminated: ["archived"],
    renewed: ["active"],
  };

  const availableTransitions = ALLOWED_TRANSITIONS[contract.status] || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button
            onClick={() => navigate("/contracts")}
            className="text-sm text-blue-600 hover:text-blue-700 mb-2 block"
          >
            &larr; Back to Contracts
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {contract.title}
          </h1>
          <p className="text-sm text-gray-500 font-mono mt-1">
            {contract.contract_number} &middot; v{contract.version}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ContractStatusBadge status={contract.status} />
        </div>
      </div>

      {/* Actions bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap gap-2">
        {availableTransitions.map((status) => (
          <button
            key={status}
            onClick={() => transitionStatus(status)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Transition to{" "}
            {status
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
        <button
          onClick={downloadPdf}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Download PDF
        </button>
        <button
          onClick={async () => {
            const dup = await duplicateContract();
            if (dup) navigate(`/contracts/${dup.id}`);
          }}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Duplicate
        </button>
        <button
          onClick={async () => {
            if (window.confirm("Are you sure you want to delete this contract?")) {
              await deleteContract();
              navigate("/contracts");
            }
          }}
          className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50 ml-auto"
        >
          Delete
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {(["overview", "parties", "clauses"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "parties" && ` (${contract.parties.length})`}
              {tab === "clauses" && ` (${contract.clauses.length})`}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview tab */}
      {activeTab === "overview" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase">Type</p>
              <p className="text-sm font-medium">
                {contract.contract_type_name || "Untyped"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Priority</p>
              <p className="text-sm font-medium">
                {getPriorityLabel(contract.priority)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Value</p>
              <p className="text-sm font-medium">
                {formatCurrency(contract.total_value, contract.currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Auto Renew</p>
              <p className="text-sm font-medium">
                {contract.auto_renew ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Effective Date</p>
              <p className="text-sm font-medium">
                {formatDate(contract.effective_date)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Expiration Date</p>
              <p className="text-sm font-medium">
                {formatDate(contract.expiration_date)}
                {contract.is_expired && (
                  <span className="ml-2 text-red-600 text-xs font-semibold">
                    EXPIRED
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Created By</p>
              <p className="text-sm font-medium">{contract.created_by_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Created At</p>
              <p className="text-sm font-medium">
                {formatDateTime(contract.created_at)}
              </p>
            </div>
          </div>

          {contract.description && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 uppercase mb-2">
                Description
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {contract.description}
              </p>
            </div>
          )}

          {contract.tags.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 uppercase mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {contract.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Parties tab */}
      {activeTab === "parties" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
          {contract.parties.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No parties added to this contract.
            </div>
          ) : (
            contract.parties.map((party) => (
              <div key={party.id} className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {party.name}
                      {party.is_primary && (
                        <span className="ml-2 text-xs text-blue-600">
                          Primary
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {party.role.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {party.organization_name && (
                      <p>{party.organization_name}</p>
                    )}
                    {party.email && <p>{party.email}</p>}
                    {party.phone && <p>{party.phone}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Clauses tab */}
      {activeTab === "clauses" && (
        <div className="space-y-4">
          {contract.clauses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
              No clauses in this contract.
            </div>
          ) : (
            contract.clauses.map((clause, idx) => (
              <div
                key={clause.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Article {idx + 1}: {clause.title}
                  </h3>
                  <span className="text-xs text-gray-500 capitalize">
                    {clause.clause_type}
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {clause.content}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ContractDetailPage;
