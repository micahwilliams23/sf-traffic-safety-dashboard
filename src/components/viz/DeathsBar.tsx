import * as d3 from "d3";
import type { YearlyBreakdown } from "@/types/data";
import { useEffect, useState } from "react";
import { LoadingIndicator } from "../application/loading-indicator/loading-indicator";
import { Toggle } from "../base/toggle/toggle";

const DeathBars = ({ yearlyBreakdown, showBreakdown }: { yearlyBreakdown: YearlyBreakdown[], showBreakdown: boolean }) => {

    if (yearlyBreakdown.length === 0) return <LoadingIndicator type="line-spinner" size="md" label="Loading..." />;

    const divWidth = parseFloat(d3.select("#deaths-bar-plot").style("width"));
    const divHeight = parseFloat(d3.select("#deaths-bar-plot").style("height"));

    // set the dimensions and margins of the graph
    const margin = { top: 50, right: 30, bottom: 30, left: 50 },
        width = divWidth - margin.left - margin.right,
        height = divHeight - margin.top - margin.bottom;

    const yScale = d3.scaleLinear()
        .domain([0, Math.max(...yearlyBreakdown.map(d => d.deaths_y2))])
        .range([height, 0]);

    const xScale = d3.scaleBand()
        .domain(yearlyBreakdown.map(d => d.year.toString()))
        .range([width, 0])
        .padding(0.2);

    const xLabels = new Set(yearlyBreakdown.map(d => {
        const year_str = d.year.toString()
        if (year_str == "2025") return "'25 ytd"
        return "'" + year_str.substring(2, 4)
    }))

    const colorScale = d3.scaleOrdinal()
        .domain(["Pedestrian", "Bicycle", "Car"])
        .range(["stroke-amber-300 fill-amber-300", "stroke-purple-400 fill-purple-400", "stroke-red-400 fill-red-400"]);

    const legendPos = { x: 75, y: 55 };
    const legendLabels = [{ label: "Car", pos: 0 }, { label: "Pedestrian", pos: 54 }, { label: "Bicycle", pos: 160 }];

    // draw graph
    useEffect(() => {

        d3.select("#deaths-bar-plot svg").selectAll("g").remove();

        const svg = d3.select("#deaths-bar-plot svg")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // add horizontal grid
        svg.selectAll("line.horizontalGrid").data(yScale.ticks(4)).enter()
            .append("line")
            .attr("class", "horizontalGrid stroke-gray-300")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", (d) => yScale(d))
            .attr("y2", (d) => yScale(d))
            .attr("fill", "none")
            .attr("shape-rendering", "crispEdges")
            .attr("stroke-width", "1px");

        // add bars
        svg.selectAll("rect")
            .data(yearlyBreakdown)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.year.toString()) ?? 0)
            .attr("y", d => yScale(d.deaths_y2))
            .attr("height", d => yScale(d.deaths_y1) - yScale(d.deaths_y2))
            .attr("width", xScale.bandwidth())
            .attr("class", d => showBreakdown ? colorScale(d.victim_type) as string : "fill-red-700 stroke-red-700");

        svg.append("g").call(d3.axisLeft(yScale).ticks(5).tickSizeOuter(0)).style("font-size", "16px");
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).tickSizeOuter(0).tickFormat((_, i) => Array.from(xLabels)[i]))
            .style("font-size", "14px");

        // add title
        d3.select("#deaths-bar-plot svg").append("g")
            .attr("transform", "translate(" + (margin.left - 12) + "," + (35) + ")")
            .append("text")
            .text(showBreakdown ? "Traffic Deaths by Year and Victim Type" : "Traffic Deaths by Year")
            .attr("class", "text-lg")
            .attr("alignment-baseline", "start")
            .attr("text-anchor", "left");

        // create tooltip
        d3.select("#deaths-bar-plot").select("#death-bars-tooltip").remove();
        const tooltip = d3.select("#deaths-bar-plot")
            .append("div")
            .attr("id", "death-bars-tooltip")
            .attr("position", "fixed")
            .style("visibility", "hidden")
            .attr("class", " absolute bg-gray-100/90 p-2 rounded-md text-left")
            .attr("z-index", 999);

        // add legend
        const legend = d3.select("#deaths-bar-plot svg").append("g")
            .attr("transform", "translate(" + (legendPos.x) + "," + (legendPos.y) + ")");
        legend.selectAll(".legend-dots")
            .data(legendLabels)
            .enter()
            .append("circle")
            .attr("cx", d => d.pos)
            .attr("cy", 0)
            .attr("r", 5)
            .attr("class", d => colorScale(d.label) as string)

        legend.selectAll(".legend-labels")
            .data(legendLabels)
            .enter()
            .append("text")
            .attr("x", d => 10 + d.pos)
            .attr("y", 1)
            .text(d => d.label)
            .style("font-size", "16px")
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "left");

        if (!showBreakdown) legend.remove();

        const mouseover = () => {
            tooltip
                .style("visibility", "visible")
        };

        const mousemove = (e: MouseEvent, d: YearlyBreakdown) => {
            const renderHtml = (d: YearlyBreakdown) => {
                const total_killed = d3.sum(yearlyBreakdown.filter(x => x.year == d.year).map(x => x.number_killed))
                const year_str = "<b>" + d.year + "</b><br/>",
                    data_str = (showBreakdown ? (d.victim_type + ": " + d.number_killed) : ("Total: <b>" + total_killed + "<b/>"));
                return year_str + data_str
            };

            // console.log(e);

            tooltip
                .html(renderHtml(d as YearlyBreakdown))
                .style("left", e.clientX + 30 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", e.clientY + window.scrollY + "px")
        };

        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        const mouseleave = () => {
            tooltip
                .style("visibility", "hidden")
        };

        d3.select("#deaths-bar-plot svg")
            .selectAll("rect")
            .on("mouseover", mouseover)
            .on("mousemove", (e, d) => mousemove(e, d as YearlyBreakdown))
            .on("mouseleave", mouseleave);

    }, [showBreakdown])

    return <>
        <svg width={divWidth} height={divHeight}>
        </svg>
    </>;
};

const BarsWithToggle = ({ yearlyBreakdown }: { yearlyBreakdown: YearlyBreakdown[] }) => {

    const [showBreakdown, setShowBreakdown] = useState(true);

    return (
        <>
            <div className="h-9/10 justify-center items-center flex" id="deaths-bar-plot">
                <DeathBars yearlyBreakdown={yearlyBreakdown} showBreakdown={showBreakdown} />
            </div><div className="flex justify-end items-center rounded-md h-1/10 mx-4" id="breakdown-toggle">
                <Toggle className="breakdown-toggle" isSelected={showBreakdown} onClick={() => {
                    setShowBreakdown(!showBreakdown);
                }} label="Show breakdown" />
            </div>
        </>
    );
};

export default BarsWithToggle;
