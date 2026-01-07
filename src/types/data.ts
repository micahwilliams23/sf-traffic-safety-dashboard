import type { DateValue } from "react-aria-components";

interface YearlyTotal {
  year: number | string;
  number_injured: number;
  number_killed: number;
}

interface MonthlyTotal extends YearlyTotal {
  month: string;
  month_num: number;
}

interface YearlyBreakdown extends YearlyTotal {
  victim_type: "Pedestrian" | "Bicycle" | "Car";
  deaths_y1: number;
  deaths_y2: number;
  injuries_y1: number;
  injuries_y2: number;
}

interface YearlyTotalYtd extends YearlyTotal {
    number_injured_ytd: number;
    number_killed_ytd: number;
}

interface AllCrashes extends YearlyBreakdown {
  datetime: Date;
  primary_rd: string;
  secondary_rd: string;
  supervisor_district: string;
  lat: number;
  lon: number;
  id?: number;
}

const DataTypes = {
  year: "int",
  number_injured: "int",
  number_killed: "int",
  number_injured_ytd: "int",
  number_killed_ytd: "int",
  number_injured_cum: "int",
  number_killed_cum: "int",
  month_num: "int",
  datetime: "date",
  supervisor_district: "int",
  lat: "float",
  lon: "float",

  deaths_y1: "int",
  deaths_y2: "int",
  injuries_y1: "int",
  injuries_y2: "int",

  // default is string
}

interface DateRange {
    start: DateValue;
    end: DateValue;
}

export type { YearlyTotal, YearlyTotalYtd, MonthlyTotal, YearlyBreakdown, AllCrashes, DateRange };
export default { DataTypes };
