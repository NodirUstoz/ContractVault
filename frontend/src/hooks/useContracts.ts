/**
 * Custom hooks for contract operations.
 * Provides convenient wrappers around the contract store and API.
 */
import { useCallback, useEffect } from "react";
import { useContractStore } from "../store/contractStore";
import { ContractFilters, contractsApi } from "../api/contracts";

/**
 * Hook to fetch and manage the contract list.
 */
export function useContractList(initialFilters?: ContractFilters) {
  const {
    contracts,
    totalCount,
    currentPage,
    totalPages,
    isListLoading,
    error,
    fetchContracts,
    setFilters,
  } = useContractStore();

  useEffect(() => {
    fetchContracts(initialFilters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const changePage = useCallback(
    (page: number) => {
      fetchContracts({ page });
    },
    [fetchContracts],
  );

  const changeFilters = useCallback(
    (filters: ContractFilters) => {
      setFilters(filters);
      fetchContracts({ ...filters, page: 1 });
    },
    [fetchContracts, setFilters],
  );

  const refresh = useCallback(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    contracts,
    totalCount,
    currentPage,
    totalPages,
    isLoading: isListLoading,
    error,
    changePage,
    changeFilters,
    refresh,
  };
}

/**
 * Hook to fetch and manage a single contract detail.
 */
export function useContractDetail(contractId: string | undefined) {
  const {
    selectedContract,
    isDetailLoading,
    error,
    fetchContract,
    updateContract,
    deleteContract,
    transitionStatus,
  } = useContractStore();

  useEffect(() => {
    if (contractId) {
      fetchContract(contractId);
    }
  }, [contractId, fetchContract]);

  const downloadPdf = useCallback(async () => {
    if (!contractId) return;
    const response = await contractsApi.generatePdf(contractId);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `contract_${selectedContract?.contract_number || contractId}.pdf`,
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }, [contractId, selectedContract]);

  const duplicateContract = useCallback(async () => {
    if (!contractId) return null;
    const { data } = await contractsApi.duplicate(contractId);
    return data;
  }, [contractId]);

  return {
    contract: selectedContract,
    isLoading: isDetailLoading,
    error,
    updateContract: (data: Record<string, unknown>) =>
      contractId ? updateContract(contractId, data) : Promise.resolve(),
    deleteContract: () =>
      contractId ? deleteContract(contractId) : Promise.resolve(),
    transitionStatus: (status: string) =>
      contractId ? transitionStatus(contractId, status) : Promise.resolve(),
    downloadPdf,
    duplicateContract,
  };
}
