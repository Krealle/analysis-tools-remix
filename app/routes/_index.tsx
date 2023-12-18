import type { MetaFunction } from "@remix-run/node";
import "../styles/index.css";
import { WCLUrlInput } from "../components/WCLUrlInput";
import Footer from "../components/Footer";
import useWCLUrlInputStore from "../zustand/WCLUrlInputStore";
import { FightBoxes } from "../components/FightBoxes";
import { SelectFightButtons } from "../components/SelectFightButtons";
import EventNormalizer from "../components/eventNormalizer/EventNormalizer";

export const meta: MetaFunction = () => {
  return [{ title: "Analysis Tools" }];
};

export default function Index() {
  const fightReport = useWCLUrlInputStore((state) => state.fightReport);
  return (
    <>
      <h1>WCL URL</h1>
      <WCLUrlInput />
      {fightReport && (
        <>
          <h2>Select fights to analyze</h2>
          <SelectFightButtons />
          <FightBoxes />
          <EventNormalizer />
        </>
      )}
      <Footer />
    </>
  );
}
