import {
  latLngBounds,
  type LatLngBounds,
  type LatLngBoundsExpression,
  type LatLngExpression,
} from "leaflet";
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import {
  Circle,
  MapContainer,
  Popup,
  SVGOverlay,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LoadingIndicator } from "../application/loading-indicator/loading-indicator";
import type { AllCrashes } from "@/types/data";
import * as d3 from "d3";
import { Badge } from "../base/badges/badges";
import type { BadgeColors } from "../base/badges/badge-types";
import { DatePickerWithDefault, VictimFilter } from "./TableFilters";
import { FilterLines } from "@untitledui/icons/FilterLines";
import { today, type DateValue } from "@internationalized/date";
import type { DateRange } from "react-aria-components";
// import type { AllCrashes } from "@/types/data";

const AddSvg = () => {
  const map = useMap();
  // set max bounds
  map.setMaxBounds(
    latLngBounds(
      {
        lat: 37.69903420794415,
        lng: -122.52811431884767,
      },
      {
        lat: 37.82090404811055,
        lng: -122.34821319580078,
      }
    )
  );
  return <SVGOverlay bounds={map.getBounds()} />;
};

const MapPoints = ({
  allCrashes,
  victim,
  dateRange,
}: {
  allCrashes: AllCrashes[];
  victim: string;
  dateRange: DateRange | null;
}) => {
  const dateOptions = {
    dateStyle: "long",
    timeStyle: "short",
  } as Intl.DateTimeFormatOptions;

  const badgeColors = {
    Pedestrian: "warning",
    Bicycle: "purple",
    Car: "error",
  };

  const colorScale = d3
    .scaleOrdinal()
    .domain(["Pedestrian", "Bicycle", "Car"])
    .range([
      "stroke-amber-300 fill-amber-300",
      "stroke-purple-400 fill-purple-400",
      "stroke-red-400 fill-red-400",
    ]) as d3.ScaleOrdinal<string, string, never>;

  const toTitleCase = (x: string) => {
    return x
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const filteredData = useMemo(() => {
    return allCrashes
      .map((d, i) => {
        return { id: i.toString(), ...d };
      })
      .filter(
        (d) =>
          d.number_killed >= 1 &&
          d.lat.toString() != "NA" &&
          d.lon.toString() != "NA"
      )
      .filter((d) => d.victim_type == victim || victim == "all")
      .filter(
        (d) =>
          dateRange == null ||
          (d.datetime >= dateRange.start.toDate("America/Los_Angeles") &&
            d.datetime <= dateRange.end.toDate("America/Los_Angeles"))
      );
  }, [allCrashes, victim, dateRange]);

  return (
    <>
      {Array.from(filteredData).map((d) => {
        return (
          <Circle
            center={[d.lat, d.lon]}
            className={colorScale(d.victim_type)}
            radius={1}
            key={d.id}
          >
            <Popup>
              <span className="my-1">
                {d.datetime.toLocaleString("en-US", dateOptions)}
                <br />
                {toTitleCase(d.primary_rd)} at {toTitleCase(d.secondary_rd)}
                <br />
                Killed: <b>{d.number_killed}</b>{" "}
                {d.number_injured >= 1 ? (
                  <>
                    Injured: <b>{d.number_injured}</b>
                  </>
                ) : (
                  <></>
                )}
              </span>
              <Badge
                className="my-1 content-end"
                type="pill-color"
                color={badgeColors[d.victim_type] as BadgeColors}
                size="sm"
              >
                {d.victim_type}
              </Badge>
            </Popup>
          </Circle>
        );
      })}
    </>
  );
};

const BaseMap = ({
  mapDim,
  allCrashes,
  victim,
  dateRange,
}: {
  mapDim: { height: number; width: number };
  allCrashes: AllCrashes[];
  victim: string;
  dateRange: DateRange | null;
}) => {
  const center = [37.76, -122.438] as LatLngExpression;
  const mapRef = useRef(null);

  const renderedMap = useMemo(() => {
    if (mapDim.height == 0) return <></>;
    return (
      <MapContainer
        center={center}
        zoom={12}
        minZoom={11}
        ref={mapRef}
        style={{ height: mapDim.height, width: mapDim.width }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <AddSvg />
        <MapPoints
          allCrashes={allCrashes}
          victim={victim}
          dateRange={dateRange}
        />
      </MapContainer>
    );
  }, [mapDim, victim, dateRange]);
  return renderedMap;
};

const InjuryMap = ({ allCrashes }: { allCrashes: AllCrashes[] }) => {
  if (allCrashes.length === 0)
    return (
      <LoadingIndicator type="line-spinner" size="md" label="Loading..." />
    );

  // set map dimensions
  const [mapDim, setMapDim] = useState({ height: 0, width: 0 });
  useEffect(() => {
    const mapDiv = document.getElementById("map-container");
    if (mapDiv == null) return;

    setMapDim({
      height: mapDiv.clientHeight - 73 - 36,
      width: mapDiv.clientWidth,
    });
  }, []);

  const now = today("America/Los_Angeles");
  const [dateRange, setDateRange] = useState<{
    start: DateValue;
    end: DateValue;
  } | null>({
    start: now.set({ year: 2014, month: 1, day: 1 }),
    end: now,
  });
  const [victim, setVictim] = useState("all");

  return (
    <div className="">
      <div className="w-full flex justify-start pt-2 pl-[40px]">
        <p className="text-lg">Crashes Resulting in Death</p>
      </div>
      <div className="w-full flex justify-start items-center gap-2 py-2">
        <FilterLines
          aria-hidden="true"
          className="w-6 h-6 stroke-gray-500 ml-4 mr-2"
        />
        <DatePickerWithDefault
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <VictimFilter victim={victim} setVictim={setVictim} />
      </div>
      <BaseMap
        mapDim={mapDim}
        allCrashes={allCrashes}
        victim={victim}
        dateRange={dateRange}
      />
    </div>
  );
};

export default InjuryMap;
