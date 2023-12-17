import { create } from "zustand";

type StatusStore = {
  isFetching: boolean;
  hasAuth: boolean;
  setIsFetching: (payload: boolean) => void;
  setHasAuth: (payload: boolean) => void;
};

const useStatusStore = create<StatusStore>((set) => ({
  isFetching: false,
  hasAuth: false /* hasValidWCLAuthentication() */,
  setIsFetching: (payload) => set({ isFetching: payload }),
  setHasAuth: (payload) => set({ hasAuth: payload }),
}));

export default useStatusStore;
