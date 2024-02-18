import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3';
import * as topojson from "topojson-client";

export default function BubbleMap({ newsData }) {

    const countryData = newsData.filter(newsItem => newsItem.country).reduce((acc, newsItem) => {
        const country = newsItem.country;
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {});

    // console.log(countryData);

    const width = 900;
    const height = 600;

    const svgRef = useRef();

    useEffect(() => {
        if (!countryData || Object.keys(countryData).length === 0) {
            return;
        }

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);
            
        // d3.json('../../public/countries.geo.json','utf8');    
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then( data => {
            // Create a map projection
            const countries=topojson.feature(data,data.objects.countries);

            const projection = d3.geoMercator().scale(140).translate([width/2,height/1.4]);

            // Create a path generator
            const path = d3.geoPath(projection);

            // Create a quantile scale for coloring countries
            const colorScale = d3.scaleQuantile()
                .domain(Object.values(countryData))
                .range(d3.schemeOrRd[9]); // Adjust the color range as needed

            // Draw the countries
            svg.selectAll('path')
                .data(countries.features)
                .enter()
                .append('path')
                .attr('class', 'country')
                .attr('d',path)
                .attr('fill', (feature) => {
                    // Use the countryData to determine the fill color
                    const countryName = feature.properties.name;
                    const dataValue = countryData[countryName] || 0; // Default to 0 if no data

                    // return d3.interpolateBlues((dataValue / d3.max(Object.values(countryData))+0.05));
                    return colorScale(dataValue);
                })
                .style('cursor', 'pointer')
                .on('mouseover', function (event, feature) {
                    d3.select(this).attr('opacity', '0.96'); // Highlight the slice
                })
                .on('mouseout', function (event, d) {
                    d3.select(this).attr('opacity', '1'); // Restore original color on mouseout
                })
                .append('title')
                .text((feature) => {
                    if(countryData[feature.properties.name]){
                        return `${feature.properties.name}: ${countryData[feature.properties.name]}`;
                    }else{
                        return `${feature.properties.name}: 0`;
                    }
                })
        });         

    }, [countryData]);

    return (
        <div className='worldMap center'>
            <h2>Most Talked About Countries</h2>
            <svg ref={svgRef}></svg>
        </div>
    );

}