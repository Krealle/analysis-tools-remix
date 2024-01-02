import { create } from "zustand";
import { WCLReport } from "../wcl/gql/reportTypes";

type WCLUrlInputStore = {
  fightReport: WCLReport | undefined;
  setFightReport: (report: WCLReport | undefined) => void;
};

const useWCLUrlInputStore = create<WCLUrlInputStore>((set) => ({
  fightReport: undefined,
  setFightReport: (report) => set({ fightReport: report }),
}));

export default useWCLUrlInputStore;
