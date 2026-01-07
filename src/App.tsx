import "./App.css";
import { useEffect, useState } from "react";
import fetchDataFromUrl from "./utils/fetch-from-url";

import type {
  YearlyTotalYtd as YearlyTotalYtdType,
  MonthlyTotal as MonthlyTotalType,
  YearlyBreakdown as YearlyBreakdownType,
  AllCrashes,
} from "@/types/data";

import Header from "./components/Header";
import InjuryCounter from "./components/viz/InjuryCounter";
import InjuryLinePlot from "./components/viz/InjuryLine";
import InjuryTable from "./components/viz/InjuryTable";
import InjuryMap from "./components/viz/InjuryMap";
import BarsWithToggle from "./components/viz/DeathsBar";

function App() {
  // fetch all crashes
  const [allCrashes, setAllCrashes] = useState([] as AllCrashes[]);
  const [yearlyTotals, setYearlyTotals] = useState([] as YearlyTotalYtdType[]);
  const [monthlyTotals, setMonthlyTotals] = useState([] as MonthlyTotalType[]);
  // const [showDescription, setShowDescription] = useState(true);
  const [yearlyBreakdown, setyearlyBreakdown] = useState(
    [] as YearlyBreakdownType[]
  );

  const urlFromBaseUrl = (gid: string) => {
    return (
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbYl-4ATCh3syEbpksovRlgYdNazyweX2WneUB0bewUdU8Vo9g5F9BxTH2I68ctyyyKhiJ7jG4muMB/pub?gid=" +
      gid +
      "&single=true&output=csv"
    );
  };
  const gids = {
    all_crashes: "1376904549",
    yearly_breakdown: "1521055632",
    monthly_totals: "1064386529",
    yearly_totals: "650351596",
  };

  // fetch yearly totals
  useEffect(() => {
    fetchDataFromUrl(
      urlFromBaseUrl(gids["yearly_totals"]),
      yearlyTotals,
      setYearlyTotals
    );
    fetchDataFromUrl(
      urlFromBaseUrl(gids["all_crashes"]),
      allCrashes,
      setAllCrashes
    );
    fetchDataFromUrl(
      urlFromBaseUrl(gids["monthly_totals"]),
      monthlyTotals,
      setMonthlyTotals
    );
    fetchDataFromUrl(
      urlFromBaseUrl(gids["yearly_breakdown"]),
      yearlyBreakdown,
      setyearlyBreakdown
    );
  }, []);

  return (
    <div className="w-[80vw] mx-auto my-0">
      <Header allCrashes={allCrashes} />
      {/* main dashboard below */}
      <>
        <div className="grid grid-cols-4 gap-4 py-4 h-[350px]">
          <div className="bg-stone-100 rounded-sm flex justify-center items-center col-span-1">
            <InjuryCounter
              yearlyTotals={yearlyTotals}
              latestCrash={
                allCrashes.length > 0 ? allCrashes[0].datetime : new Date()
              }
            />
          </div>
          <div
            className="bg-stone-100 rounded-sm flex justify-center items-center col-span-3 h-full"
            id="injury-line-plot"
          >
            <InjuryLinePlot monthlyTotals={monthlyTotals} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 h-[50vh]">
          <div
            className="bg-stone-100 rounded-sm flex justify-center items-center"
            id="map-container"
          >
            {/* Street Map Bubble Chart */}
            <InjuryMap allCrashes={allCrashes} />
          </div>
          <div className="bg-stone-100 rounded-sm justify-center items-center">
            <BarsWithToggle yearlyBreakdown={yearlyBreakdown} />
          </div>
        </div>
      </>
      <div className="bg-stone-100 rounded-sm justify-center items-center mt-4 relative">
        <InjuryTable allCrashes={allCrashes} />
      </div>
      <div className="mt-8 justify-end flex content-center">
        <div className="justify-items-end">
          <span className="text-gray-400">
            developed by{" "}
            <a
              href="https://www.linkedin.com/in/micahwilliams23"
              target="_blank"
            >
              Micah Williams
            </a>
          </span>
          <div className="flex">
            <span className="text-gray-400">Send me a message!</span>
            <a
              href="https://www.linkedin.com/in/micahwilliams23"
              target="_blank"
            >
              <img
                height={20}
                width={20}
                className="justify-self-end ml-2"
                src="src/assets/linkedin.svg"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
