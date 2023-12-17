import type { MetaFunction } from "@remix-run/node";
import "../styles/index.css";
import { WCLUrlInput } from "../components/WCLUrlInput";
import Footer from "../components/Footer";

export const meta: MetaFunction = () => {
  return [{ title: "Analysis Tools" }];
};

export default function Index() {
  return (
    <>
      <h1>WCL URL</h1>
      <WCLUrlInput />
      <Footer />
    </>
  );
}
