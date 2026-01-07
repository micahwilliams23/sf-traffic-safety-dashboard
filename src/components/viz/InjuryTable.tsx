import { useEffect, useState } from "react";
import { today, startOfYear, type DateValue, } from "@internationalized/date";
import type { SortDescriptor } from "react-aria-components";
import { Table, TableCard } from "@/components/application/table/table";
import type { AllCrashes, DateRange } from "@/types/data";
import { PaginationPageMinimalCenter } from "../application/pagination/pagination";
import { Badge } from "../base/badges/badges";
import type { BadgeColors } from "../base/badges/badge-types";
import { LoadingIndicator } from "../application/loading-indicator/loading-indicator";
import TableFilters from "./TableFilters";

interface TableBodyProps {
    filteredData: AllCrashes[];
    totalRowCount: number;
    sortDescriptor: SortDescriptor;
    setSortDescriptor: React.Dispatch<React.SetStateAction<SortDescriptor>>;
}

const TableBody = ({ filteredData, sortDescriptor, setSortDescriptor, totalRowCount }: TableBodyProps) => {

    const resultLength = 10,
        pageCount = Math.ceil(filteredData.length / resultLength),
        [currentPage, setCurrentPage] = useState(1);

    const result = filteredData.slice(resultLength * (currentPage - 1), Math.min(resultLength * currentPage - 1, filteredData.length));
    const totals = filteredData.reduce((p, c, _) => {
        if (typeof c.number_killed != "number") return p;
        p.number_killed = p.number_killed + c.number_killed
        p.number_injured = p.number_injured + c.number_injured
        return p
    }, { number_killed: 0, number_injured: 0 });

    const badgeColors = {
        Pedestrian: "warning",
        Bicycle: "purple",
        Car: "error"
    };

    const dateOptions = {
        dateStyle: "long",
        timeStyle: "short"
    } as Intl.DateTimeFormatOptions;

    const formatNumber = (num: number) => {
        const formatter = Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1
        })
        return formatter.format(num);
    };

    return (
        <>
            <TableCard.Root size="sm">
                <Table className="w-full" aria-label="Crashes" selectionMode="none" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
                    <Table.Header className="bg-primary">
                        <Table.Head id="datetime" label="Date" isRowHeader allowsSorting />
                        <Table.Head id="primary_rd" label="Primary Road" />
                        <Table.Head id="secondard_rd" label="Secondary Road" />
                        <Table.Head id="number_injured" label="Injuries" allowsSorting />
                        <Table.Head id="number_killed" label="Deaths" allowsSorting />
                        <Table.Head id="victim_type" label="Victim Type" />
                        <Table.Head id="supervisor_district" label="Supe. District" />
                    </Table.Header>
                    <Table.Body items={result}>
                        {(item) => (
                            <Table.Row id={item.id} className="odd:bg-secondary_subtle py-1">
                                <Table.Cell>
                                    <p>{item.datetime.toLocaleString("en-US", dateOptions)}</p>
                                </Table.Cell>
                                <Table.Cell>
                                    <p>{item.primary_rd}</p>
                                </Table.Cell>
                                <Table.Cell>
                                    <p>{item.secondary_rd}</p>
                                </Table.Cell>
                                <Table.Cell>
                                    <p>{item.number_injured}</p>
                                </Table.Cell>
                                <Table.Cell>
                                    <p>{item.number_killed}</p>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex justify-center">
                                        <Badge type="pill-color" color={badgeColors[item.victim_type] as BadgeColors} size="sm">
                                            {item.victim_type}
                                        </Badge>
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex justify-center">
                                        <Badge type="pill-color" color="brand" size="sm">
                                            District {item.supervisor_district}
                                        </Badge>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
                <PaginationPageMinimalCenter page={currentPage} total={pageCount} onPageChange={(p) => setCurrentPage(p)} className="px-4 py-3 md:px-6 md:pt-3 md:pb-4" />
            </TableCard.Root >
            <div className="text-sm p-3">
                {filteredData.length > 0 ?
                    <p className="text-slate-400 ">
                        {formatNumber(filteredData.length)}/{formatNumber(totalRowCount)} rows; {totals.number_injured.toLocaleString()} injuries; {totals.number_killed} fatalities
                    </p> :
                    <p className="text-slate-400 ">
                        No results. 0/{formatNumber(totalRowCount)} rows.
                    </p>}
            </div>
        </>
    );
};

const InjuryTable = ({ allCrashes }: { allCrashes: AllCrashes[] }) => {

    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "datetime",
        direction: "descending",
    });

    const now = today("America/Los_Angeles");
    const [dateRange, setDateRange] = useState<{
        start: DateValue; end: DateValue
    } | null>({
        start: startOfYear(now).subtract({years: 1}),
        end: now,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [district, setDistrict] = useState('all');
    const [victim, setVictim] = useState('all');
    const [streetFilter, setStreetFilter] = useState('');
    const [fatalOnly, setFatalOnly] = useState(false);
    const [filteredData, setFilteredData] = useState([] as AllCrashes[]);

    useEffect(() => {
        if (allCrashes.length == 0) return;
        if (dateRange == undefined) return;

        const filtered = allCrashes
            .filter(d => d.datetime >= dateRange.start.toDate("America/Los_Angeles") &&
                d.datetime <= dateRange.end.toDate("America/Los_Angeles"))
            .filter(d => fatalOnly ? d.number_killed > 0 : d.number_injured > 0 || d.number_killed > 0) // fatal filter
            .filter(d => district == 'all' || d.supervisor_district == district) // supervisor district filter
            .filter(d => victim == 'all' || d.victim_type == victim) // victim type filter
            .filter(d => d.primary_rd.toLowerCase().match(streetFilter) || d.secondary_rd.toLowerCase().match(streetFilter)) // victim type filter
            .map((d, i) => {
                return {
                    ...d,
                    id: i // generate id
                }
            })
        filtered.sort((a, b) => {
            const first = a[sortDescriptor.column as keyof typeof a];
            const second = b[sortDescriptor.column as keyof typeof b];
            // console.log(first,second);

            // Compare numbers or booleans
            if ((typeof first === "number" && typeof second === "number") || (typeof first === "boolean" && typeof second === "boolean")) {
                return sortDescriptor.direction === "descending" ? second - first : first - second;
            }

            // Compare dates
            if (typeof first === "object" && typeof second === "object") {
                // console.log(first.getTime(), second.getTime());
                return sortDescriptor.direction === "descending" ?
                    second.getTime() - first.getTime() :
                    first.getTime() - second.getTime();
            }

            // Compare strings
            if (typeof first === "string" && typeof second === "string") {
                let cmp = first.localeCompare(second);
                if (sortDescriptor.direction === "descending") {
                    cmp *= -1;
                }
                return cmp;
            }
            return 0;
        });
        setFilteredData(filtered);
        setIsLoading(false);
    }, [sortDescriptor, allCrashes, dateRange, district, victim, fatalOnly, streetFilter]);

    return <>
    <div className="w-full flex justify-start pt-2 pl-[40px]">
        <p className="text-lg">Crashes Resulting in Injuries or Deaths</p>
    </div>
        <div className="w-full p-3 border-b-2 border-stone-200 text-left font-bold">
            <TableFilters
                dateRange={dateRange}
                setDateRange={setDateRange}
                district={district}
                setDistrict={setDistrict}
                victim={victim}
                setVictim={setVictim}
                setStreetFilter={setStreetFilter}
                fatalOnly={fatalOnly}
                setFatalOnly={setFatalOnly}
            />
        </div>
        <div className="w-full">
            {
                isLoading ?
                    <div className="min-h-[425px] flex justify-center content-center">
                        <LoadingIndicator type="line-spinner" size="md" label="Loading..." />
                    </div> :
                    <TableBody
                        filteredData={filteredData}
                        totalRowCount={allCrashes.length}
                        sortDescriptor={sortDescriptor}
                        setSortDescriptor={setSortDescriptor}
                    />
            }
        </div>
    </>;
};


export default InjuryTable;
export type { DateRange };
