import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3';

export default function PieChart(news) {

    const regionData = news.newsData.filter(newsItem => newsItem.region).reduce((acc, newsItem) => {
        const region = newsItem.region.toUpperCase().split(' ');
        let regionNew;
        region.length>1?regionNew=region[1]:regionNew=region;
        acc[regionNew] = (acc[regionNew] || 0) + 1;
        return acc;
    }, {});

    let width = 500;
    let height = 500;
    let margin = 50;

    const radius = Math.min(width, height) / 2 - margin;

    const svgRef = useRef();

    useEffect(() => {
        if (!regionData || Object.keys(regionData).length === 0) {
            return;
        }

        // console.log(regionData);

        const colorScale = d3.scaleOrdinal().range(['#2f4b7c','#d45087','#0080ff','#5cb85c','#b8cc26','#ff6347']);

        const pie = d3.pie().value(d => d.value);

        const dataForPie = Object.entries(regionData).map(([key, value]) => ({ key, value }));

        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        const svg = d3.select(svgRef.current);

        svg.selectAll('*').remove(); // Clear previous chart

        const pieChart = svg
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        const arcs = pie(dataForPie);

        pieChart
            .selectAll('path')
            .data(arcs)
            .enter()
            .append('path')
            .attr('fill', (d, i) => colorScale(i))
            .attr('d', arc)
            .style('cursor', 'pointer') // Add pointer cursor on hover
            .on('mouseover', function (event, d) {
                d3.select(this).attr('opacity', '0.80'); // Highlight the slice
            })
            .on('mouseout', function (event, d) {
                d3.select(this).attr('opacity', '1'); // Restore original color on mouseout
            })
            .append('title')
            .text(d => `${d.data.key}: ${d.data.value}`)



    }, [regionData, width, height, radius]);

    return (
        <div className='PieChart_region center'>

            <h2>World Region in Focus</h2>

            <svg ref={svgRef} width={width} height={height}>
                <g transform={`translate(${width / 2},${height / 2})`} />
            </svg>

        </div>
    );

}