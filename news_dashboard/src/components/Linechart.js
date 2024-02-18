import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3';

export default function WordChart({ newsData }) {

    const timeData = newsData.filter(newsItem => newsItem.start_year).reduce((acc, newsItem) => {
        const year = newsItem.start_year;
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {});

    console.log(timeData);

    const svgRef = useRef();

    useEffect(() => {
        const margin = 25;
        const width = 800;
        const height = 500;

        if (!timeData || Object.keys(timeData).length === 0) {
            return;
        }

        const svg = d3.select(svgRef.current)
            .attr('width', width + margin)
            .attr('height', height + margin);

        // Define scales
        const timerange=d3.extent(Object.keys(timeData).map(year=>+year));
        timerange[0]-=2;
        timerange[1]+=2;
        console.log(timerange);
        const xScale = d3.scaleLinear()
            .domain(d3.extent(timerange))
            .range([0, width-margin]);

        const yScale = d3.scaleLinear()
            .domain([0, 200])
            .range([height-margin, 0]);

        // Add x axis
        svg.append('g')
            .attr('transform', `translate(${margin}, ${height})`)
            .call(d3.axisBottom(xScale).ticks(17));

        // Add y axis
        svg.append('g')
            .attr('transform', `translate(${margin}, ${margin})`)
            // .call(d3.axisLeft(yScale))
            .call(d3.axisLeft(yScale).ticks(20));

        // Draw the line
        const line = d3.line()
            .x(d => xScale(+d[0]))
            .y(d => yScale(d[1]));


        svg.append('path')
            .datum(Object.entries(timeData))
            .attr('fill', 'none')
            .attr('stroke', 'steelblue') // Adjust the color of the line as needed
            .attr('stroke-width', 5) // Adjust the width of the line as needed
            .attr('d', line)
            .attr('transform',`translate(${margin},${margin})`)
            // .append('title')
            // .text((d,i) =>  `${d[i]}`)
            .on('mouseover', function (event, d) {
                const [x, y] = d3.pointer(event);
                svg.append('text')
                  .attr('id', 'tooltip')
                  .attr('x', x)
                  .attr('y', y)
                  .text(`Year: ${Math.round(xScale.invert(x))}, News Count: ${Math.round(yScale.invert(y))}`);
              })
              .on('mouseout', function () {
                svg.select('#tooltip').remove();
              });
        

    }, [timeData]);


    return (
        <div className='yearLine center'>
            <h2>News Year by Year </h2>
            <svg ref={svgRef}></svg>
        </div>
    );

}