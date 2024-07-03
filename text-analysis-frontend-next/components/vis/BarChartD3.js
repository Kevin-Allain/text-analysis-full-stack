import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChartD3 = ({ data, selectBar }) => {

  console.log("BarChartD3 | data: ",data,", selectBar: ",selectBar);

  const svgRef = useRef();
  const tooltipRef = useRef();
  const margin = { top: 20, right: 30, bottom: 45, left: 45 };
  const height = 400;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = svg.node().parentElement.clientWidth;
    const tooltip = d3.select(tooltipRef.current);

    // var coordinates = d3.pointer(this);
    // var xMouse = coordinates[0];
    // var yMouse = coordinates[1];  

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width - margin.left - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - margin.top - margin.bottom, 0]);

    // Clear previous chart
    svg.selectAll("*").remove();

    // Append the group for the chart
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw X axis
    g.append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-20)")
      .style("text-anchor", "end")
      .style("font-size", 10);
    // .style("fill", "#69a3b2");

    // Draw Y axis with custom labels
    const yAxis = d3
      .axisLeft(y)
      .ticks(10)
      .tickFormat((d) => {
        if (d === 0) return "Low";
        if (d === 0.4) return "Medium";
        if (d === 0.8) return "High";
        return "";
      });
    g.append("g").call(yAxis).style("font-size", 10);

    // Draw horizontal dashed lines at 0.4 and 0.8
    g.append("line")
      .attr("x1", 0)
      .attr("x2", width - margin.left - margin.right)
      .attr("y1", y(0.4))
      .attr("y2", y(0.4))
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");

    g.append("line")
      .attr("x1", 0)
      .attr("x2", width - margin.left - margin.right)
      .attr("y1", y(0.8))
      .attr("y2", y(0.8))
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");

    // Draw bars with colors based on value ranges
    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - margin.top - margin.bottom - y(d.value))
      .attr("fill", (d) => {
        if (d.value < 0.4) return "green";
        if (d.value < 0.8) return "orange";
        return "red";
      })
      ;

    // Add invisible tracking zones over each bar
    g.selectAll(".hover-rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "hover-rect")
      .attr("x", (d) => x(d.name))
      .attr("y", 0)
      .attr("width", x.bandwidth())
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "transparent")
      .attr("pointer-events", "all")
      .on("mousemove", (event, d) => {
        tooltip
          .style("left", `${ 2.5}%`) // event.screenX +
          .style("top", `${ 2.5}%`) // event.screenY +
          .style("opacity", 0.8)
          .style("width", `${95}%`)
          .html(`<strong>${d.name}</strong><br/>Value: ${d.value}<br/>Description: ${d.description}`);
        d3.select(event.target).attr("fill", "rgba(200, 200, 200, 0.3)");
      })
      .on("mouseout", (event) => {
        tooltip.style("opacity", 0);
        d3.select(event.target).attr("fill", "transparent");
      })
      .on("mousedown", (event,d) => {
        console.log("mousedown rect | d: ",d);
        selectBar(d.name)
      })
      ;
  });
  // }, [data]);

  return (
    <>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          opacity: 0,
          backgroundColor: "white",
          border: "1px solid gray",
          borderRadius: "4px",
          padding: "8px",
          pointerEvents: "none",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      ></div>
    </>
  );
};

export default BarChartD3;
