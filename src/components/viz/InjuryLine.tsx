// @ts-nocheck

import type { MonthlyTotal } from "@/types/data";
import * as d3 from "d3";
import { useEffect, useMemo } from "react";
import { LoadingIndicator } from "../application/loading-indicator/loading-indicator";

const InjuryLinePlot = ({ monthlyTotals }: { monthlyTotals: MonthlyTotal[] }) => {

    if (monthlyTotals.length === 0) return <LoadingIndicator type="line-spinner" size="md" label="Loading..." />;

    const divWidth = parseFloat(d3.select("#injury-line-plot").style("width"));
    const divHeight = parseFloat(d3.select("#injury-line-plot").style("height"));

    // set the dimensions and margins of the graph
    const margin = { top: 50, right: 30, bottom: 50, left: 50 },
        width = divWidth - margin.left - margin.right,
        height = divHeight - margin.top - margin.bottom;

    const yScale = d3.scaleLinear()
        .domain([0, Math.max(...monthlyTotals.map(d => d.number_injured_cum))])
        .range([height, 0]);

    const xScale = d3.scaleLinear()
        .domain([0, 12])
        .range([0, width]);

    const colorScale = d3.scaleThreshold()
        .domain([2020, 2025])
        .range(["stroke-gray-300", "stroke-red-200", "stroke-red-700"])

    const fillScale = d3.scaleThreshold()
        .domain([2020, 2025])
        .range(["fill-gray-300", "fill-red-200", "fill-red-700"])

    const opacityScale = d3.scaleThreshold()
        .domain([2020, 2024])
        .range([0.4, 1])


    const lineBuilder = d3
        .line()
        .x((d) => xScale(d.month_num))
        .y((d) => yScale(d.number_injured));

    const reformattedData = useMemo(() => {
        const reformattedData = []
        Map.groupBy(monthlyTotals, d => d.year).forEach((v, k) => {
            v = v.reduce((arr, cur, _) => {
                arr = [...arr, { month_num: cur.month_num, number_injured: cur.number_injured_cum }]
                return arr
            }, [{ month_num: 0, number_injured: 0 }]);
            reformattedData.push({ year: k, values: v });
        });
        return reformattedData.reverse();
    }, [monthlyTotals]);

    const legendPos = { x: 300, y: 30 };
    const legendPts = [
        {
            label: "2025",
            value: 2025,
            pos: 0
        },
        {
            label: "Previous 5 years",
            value: 2024,
            pos: 60
        },
        {
            label: "Earlier data",
            value: 2014,
            pos: 200
        }
    ];


    useEffect(() => {

        const months = ["Jan", "Feb", "March", "April", "May", "June",
            "July", "Aug", "Sep", "Oct", "Nov", "Dec"]

        const svg = d3.select("#injury-line-plot svg").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // add grid
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

            svg.selectAll("line.verticalGrid").data(xScale.ticks()).enter()
            .append("line")
            .attr("class", "verticalGrid stroke-gray-300")
            .attr("y1", 0)
            .attr("y2", height)
            .attr("x1", (d) => xScale(d))
            .attr("x2", (d) => xScale(d))
            .attr("fill", "none")
            .attr("shape-rendering", "crispEdges")
            .attr("stroke-width", "1px");

        svg.selectAll(".injury-lines")
            .data(reformattedData)
            .enter()
            .append("path")
            .attr("d", d => lineBuilder(d.values))
            .attr("class", d => colorScale(d.year))
            .attr("opacity", d => opacityScale(d.year))
            .attr("stroke-width", 2)
            .attr("fill", "none")

        svg.append("g").call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format("~s")).tickSizeOuter(0)).style("font-size", "16px");
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).ticks(12).tickFormat((d) => months[d]))
            .style("font-size", "16px")
            .selectAll("text")
            .attr("text-anchor", "start")
            .attr("transform", "translate(10,0)");


        // add legend
        const legend = d3.select("#injury-line-plot svg").append("g")
            .attr("transform", "translate(" + (legendPos.x) + "," + (legendPos.y) + ")");
        legend.selectAll(".legend-dots")
            .data(legendPts)
            .enter()
            .append("circle")
            .attr("cx", d => d.pos)
            .attr("cy", 0)
            .attr("r", 5)
            .attr("class", d => colorScale(d.value) + " " + fillScale(d.value))

        legend.selectAll(".legend-labels")
            .data(legendPts)
            .enter()
            .append("text")
            .attr("x", d => d.pos + 10)
            .attr("y", d => 1)
            .text(d => d.label)
            .style("font-size", "16px")
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "left");

        // add title
        const title = d3.select("#injury-line-plot svg").append("g")
            .attr("transform", "translate(" + (margin.left - 12) + "," + (35) + ")")
            .append("text")
            .text("Total Injuries by Year")
            .attr("class", "text-lg")
            .attr("alignment-baseline", "start")
            .attr("text-anchor", "left");

    }, [])


    return <>
        <svg width={divWidth} height={divHeight}>
        </svg>
    </>
};

export default InjuryLinePlot;
