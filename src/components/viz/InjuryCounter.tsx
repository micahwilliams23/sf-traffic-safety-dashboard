import type { YearlyTotalYtd } from "@/types/data";
import { LoadingIndicator } from "../application/loading-indicator/loading-indicator";

const InjuryCounter = ({
  yearlyTotals,
  latestCrash,
}: {
  yearlyTotals: YearlyTotalYtd[];
  latestCrash: Date;
}) => {
  // show loading indicator if there is no data
  if (yearlyTotals.length == 0)
    return (
      <LoadingIndicator type="line-spinner" size="md" label="Loading..." />
    );

  // const ytdInjuries = yearlyTotals.filter((d) => d.year == new Date().getFullYear())[0].number_injured;
  // const ytdInjuriesLastYear = yearlyTotals.filter((d) => d.year == new Date().getFullYear() - 1)[0].number_injured_ytd;
  const ytdInjuries = yearlyTotals.filter((d) => d.year == 2025)[0]
    .number_injured;
  const ytdInjuriesLastYear = yearlyTotals.filter((d) => d.year == 2024)[0]
    .number_injured_ytd;
  const yoyChange = ytdInjuries - ytdInjuriesLastYear;
  const yoyChangePercent =
    (100.0 * (ytdInjuries - ytdInjuriesLastYear)) / ytdInjuriesLastYear;

  const latestCrashFormatted = latestCrash?.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  } as Intl.DateTimeFormatOptions);

  return (
    <div className="h-full flex-col justify-between py-8">
      <div className="flex justify-center text-xl mb-3">
        <h5>2025 (to {latestCrashFormatted})</h5>
      </div>
      <div className="flex justify-center text-red-700 text-2xl">
        <h1>{ytdInjuries.toLocaleString()}</h1>
      </div>
      <div className="flex justify-center text-xl mt-6">INJURIES</div>
      <div className="">
        <hr className="mb-4"></hr>
        <div>
          <p className="text-xl text-gray-500">
            <span className={yoyChange >= 0 ? "text-red-800" : "text-blue-800"}>
              {yoyChange.toLocaleString()}
            </span>{" "}
            vs. 2024 YTD
          </p>
        </div>
        <div>
          <p className="text-xl text-gray-500">
            <span className={yoyChange >= 0 ? "text-red-800" : "text-blue-800"}>
              {yoyChangePercent.toFixed(1)}%
            </span>{" "}
            vs. 2024 YTD
          </p>
        </div>
      </div>
    </div>
  );
};

export default InjuryCounter;
