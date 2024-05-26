import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3';


export default function ScatterPlot({ newsData }) {

    const likevsIntenseData = newsData
        .filter((newsItem) => newsItem.likelihood && newsItem.intensity)
        .map((newsItem) => ({
            likelihood: newsItem.likelihood,
            intensity: newsItem.intensity
        }))

    // console.log(likevsIntenseData);

    const svgRef = useRef();

    useEffect(() => {
        const margin = 50;
        const width = 600 - margin;
        const height = 500 - margin;

        if (!likevsIntenseData || Object.keys(likevsIntenseData).length === 0) {
            return;
        }

        const svg = d3.select(svgRef.current)
            .attr('viewBox', `0 0 ${width+margin} ${height+margin}`)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .classed('svg-content-responsive', true);

        // Define scales
        const xScale = d3.scaleLinear()
            .domain([0, 5])
            .range([0, width-margin]);

        const yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([height-margin, 0]);

        // Add x axis
        svg.append('g')
            .attr('transform', `translate(${margin}, ${height})`)
            .call(d3.axisBottom(xScale));

        // Add y axis
        svg.append('g')
            .attr('transform',`translate(${margin},${margin})`)
            .call(d3.axisLeft(yScale));

        // Draw data points
        svg.selectAll('circle')
            .data(likevsIntenseData)
            .enter().append('circle')
            .attr('cx', d => xScale(d.likelihood))
            .attr('cy', d => yScale(d.intensity))
            .attr('transform', `translate(${margin}, ${margin})`)
            .attr('r', 5) // Adjust the radius of the circles as needed
            .attr('fill', 'steelblue')
            .style('cursor', 'pointer')
            .on('mouseover', function (event, feature) {
                d3.select(this).attr('fill', 'black'); // Highlight the slice
            })
            .on('mouseout', function (event, d) {
                d3.select(this).attr('fill', 'steelblue'); // Restore original color on mouseout
            })
            .append('title')
            .text((d) =>  `Intensity: ${d.intensity}`);

    }, [likevsIntenseData]);

    return (
        <div className='barChart relative flex flex-col gap-5 justify-center items-center bg-light-gray border rounded-3xl pt-5 col-span-12 md:col-span-4'>
            <div>
                <h2 className='font-semibold text-xl text-center font-montserrat'>How Serious Is your News</h2>
                <h2 className='font-md text-md text-center font-montserrat'>Likelihood V/S Intensity</h2>
            </div>
            <svg ref={svgRef}></svg>
        </div>
    );

}