
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker.tsx";
import { FilterLines } from "@untitledui/icons";
import { Select } from "@/components/base/select/select";
import { range } from "@/utils/range";
import { SearchSm } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import type { AllCrashes, DateRange } from "@/types/data";
import { type Dispatch } from "react";
import type { DateValue } from "react-aria-components";

const VictimTypes = [
  {
    label: "All",
    id: "all",
  },
  {
    label: "Pedestrian",
    id: "Pedestrian",
  },
  {
    label: "Bicycle",
    id: "Bicycle",
  },
  {
    label: "Car",
    id: "Car",
  },
];

const DatePickerWithDefault = ({ dateRange, setDateRange }: {
  dateRange: DateRange | null;
  setDateRange: Dispatch<React.SetStateAction<{
    start: DateValue;
    end: DateValue;
  } | null>>;
}) => {
  return (
    <div>
      <div className="flex justify-start text-xs text-gray-400 ml-2 p-0 h-auto">
        DATE RANGE
      </div>
      <DateRangePicker
        aria-label="Date range picker"
        isRequired
        shouldCloseOnSelect={false}
        value={dateRange}
        onChange={(v) => { setDateRange(v) }}
      />
    </div>
  );
};

const SupeDistrictFilter = ({ district, setDistrict }: {
  district: AllCrashes["supervisor_district"],
  setDistrict: Dispatch<React.SetStateAction<AllCrashes["supervisor_district"]>>
}) => {
  var items = range(1, 12).map((i) => ({
    label: `District ${i}`,
    id: `${i}`,
  }));

  items = [{ label: "All Districts", id: "all" }, ...items];

  return (
    <div className="w-36">
      <div className="flex justify-start text-xs text-gray-400 ml-2 p-0 h-auto">
        DISTRICT
      </div>
      <Select
        aria-label="Select district"
        isRequired
        defaultValue={"all"}
        items={items}
        className={"p-0"}
        selected={district}
        setSelected={setDistrict}
      >
        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
      </Select>
    </div>
  );
};

const VictimFilter = ({ victim, setVictim }: {
  victim: string,
  setVictim: Dispatch<React.SetStateAction<any>>
}) => {

  return (
    <div className="w-36">
      <div className="flex justify-start text-xs text-gray-400 ml-2 p-0 h-auto">
        VICTIM TYPE
      </div>
      <Select
        size="sm"
        aria-label="Select victim type"
        isRequired
        defaultValue={"all"}
        items={VictimTypes}
        className={"text-sm p-0"}
        selected={victim}
        setSelected={setVictim}
      >
        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
      </Select>
    </div>
  );
};

const FatalFilter = ({ fatalOnly, setFatalOnly }: { fatalOnly: boolean, setFatalOnly: Dispatch<React.SetStateAction<boolean>> }) => {

  // return <Checkbox isSelected={fatalOnly} onChange={setFatalOnly} label="Fatal Only" size="sm" />;

  const fatalTypes = [
    {
      id: "all",
      label: "All"
    },
    {
      id: "fatal",
      label: "Fatal only"
    }
  ] as { id: string, label: string, value: boolean }[];

  return (
    <div className="w-36">
      <div className="flex justify-start text-xs text-gray-400 ml-2 p-0 h-auto">
        FATAL ONLY
      </div>
      <Select
        size="sm"
        aria-label="Select victim type"
        isRequired
        defaultValue={"all"}
        items={fatalTypes}
        className={"text-sm p-0"}
        selected={fatalOnly}
        setSelected={(d) => setFatalOnly(d == 'all' ? false : true)}
      >
        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
      </Select>
    </div>
  );
};

const StreetFilter = ({ setStreetFilter }: {
  setStreetFilter: Dispatch<React.SetStateAction<any>>
}) => {

  return (
    <>
      <div className="w-45">
        <div className="flex justify-start text-xs text-gray-400 ml-2 p-0 h-auto">
          STREET SEARCH
        </div>
        <Input
          size="sm"
          aria-label="Street search"
          icon={SearchSm}
          onKeyUpFn={e => setStreetFilter(e.value.toLowerCase())}
        />
      </div>
    </>
  );
};

const TableFilters = ({ dateRange, setDateRange, district, setDistrict, victim, setVictim, setStreetFilter, fatalOnly, setFatalOnly }: {
  dateRange: DateRange | null;
  setDateRange: Dispatch<React.SetStateAction<{
    start: DateValue;
    end: DateValue;
  } | null>>;

  district: AllCrashes["supervisor_district"];
  setDistrict: Dispatch<React.SetStateAction<AllCrashes["supervisor_district"]>>;

  victim: string;
  setVictim: Dispatch<React.SetStateAction<any>>;

  setStreetFilter: Dispatch<React.SetStateAction<string>>;

  fatalOnly: boolean;
  setFatalOnly: Dispatch<React.SetStateAction<boolean>>;

}) => {
  return (
    <div className="flex justify-start items-center gap-4">
      <FilterLines
        aria-hidden="true"
        className="w-6 h-6 stroke-gray-500 ml-4"
      />
      <DatePickerWithDefault dateRange={dateRange} setDateRange={setDateRange} />
      <SupeDistrictFilter district={district} setDistrict={setDistrict} />
      <VictimFilter victim={victim} setVictim={setVictim} />
      <FatalFilter fatalOnly={fatalOnly} setFatalOnly={setFatalOnly} />
      <StreetFilter setStreetFilter={setStreetFilter} />
    </div>
  );
}

export default TableFilters;
export { DatePickerWithDefault, VictimFilter };
