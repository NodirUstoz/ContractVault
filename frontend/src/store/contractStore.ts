/**
 * Zustand store for contract state management.
 * Handles list, detail, filters, and CRUD operations.
 */
import { create } from "zustand";
import {
  contractsApi,
  ContractListItem,
  ContractDetail,
  ContractFilters,
  PaginatedResponse,
} from "../api/contracts";

interface ContractState {
  /* list */
  contracts: ContractListItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  filters: ContractFilters;
  isListLoading: boolean;

  /* detail */
  selectedContract: ContractDetail | null;
  isDetailLoading: boolean;

  /* errors */
  error: string | null;

  /* actions */
  fetchContracts: (filters?: ContractFilters) => Promise<void>;
  fetchContract: (id: string) => Promise<void>;
  createContract: (data: Partial<ContractDetail>) => Promise<ContractDetail>;
  updateContract: (id: string, data: Partial<ContractDetail>) => Promise<void>;
  deleteContract: (id: string) => Promise<void>;
  transitionStatus: (id: string, status: string) => Promise<void>;
  setFilters: (filters: ContractFilters) => void;
  clearError: () => void;
}

export const useContractStore = create<ContractState>((set, get) => ({
  contracts: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  pageSize: 20,
  filters: {},
  isListLoading: false,

  selectedContract: null,
  isDetailLoading: false,

  error: null,

  async fetchContracts(filters?: ContractFilters) {
    const mergedFilters = { ...get().filters, ...filters };
    set({ isListLoading: true, error: null, filters: mergedFilters });

    try {
      const { data } = await contractsApi.list(mergedFilters);
      set({
        contracts: data.results,
        totalCount: data.count,
        currentPage: data.current_page,
        totalPages: data.total_pages,
        pageSize: data.page_size,
        isListLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.error?.message || "Failed to load contracts.",
        isListLoading: false,
      });
    }
  },

  async fetchContract(id: string) {
    set({ isDetailLoading: true, error: null });
    try {
      const { data } = await contractsApi.get(id);
      set({ selectedContract: data, isDetailLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.error?.message || "Failed to load contract.",
        isDetailLoading: false,
      });
    }
  },

  async createContract(data: Partial<ContractDetail>) {
    set({ error: null });
    try {
      const { data: created } = await contractsApi.create(data);
      // Refresh list
      get().fetchContracts();
      return created;
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || "Failed to create contract.";
      set({ error: msg });
      throw err;
    }
  },

  async updateContract(id: string, data: Partial<ContractDetail>) {
    set({ error: null });
    try {
      const { data: updated } = await contractsApi.update(id, data);
      set({ selectedContract: updated });
      get().fetchContracts();
    } catch (err: any) {
      set({ error: err.response?.data?.error?.message || "Failed to update contract." });
      throw err;
    }
  },

  async deleteContract(id: string) {
    set({ error: null });
    try {
      await contractsApi.delete(id);
      set({ selectedContract: null });
      get().fetchContracts();
    } catch (err: any) {
      set({ error: err.response?.data?.error?.message || "Failed to delete contract." });
      throw err;
    }
  },

  async transitionStatus(id: string, status: string) {
    set({ error: null });
    try {
      const { data } = await contractsApi.transition(id, status);
      set({ selectedContract: data });
      get().fetchContracts();
    } catch (err: any) {
      set({
        error: err.response?.data?.error?.message || "Status transition failed.",
      });
      throw err;
    }
  },

  setFilters(filters: ContractFilters) {
    set({ filters });
  },

  clearError() {
    set({ error: null });
  },
}));
