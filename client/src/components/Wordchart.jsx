import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3';
import cloud from 'd3-cloud';

export default function WordChart({ newsData }) {

    const topicData = newsData.filter(newsItem => newsItem.topic).reduce((acc, newsItem) => {
        const topic = newsItem.topic;
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
    }, {});

    // console.log(topicData);

    const svgRef = useRef();

    useEffect(() => {
        const margin = 20;
        const width = 800 - margin;
        const height = 750 - margin;

        if (!topicData || Object.keys(topicData).length === 0) {
            return;
        }

        const svg = d3.select(svgRef.current)
            .attr('viewBox', `0 0 ${width + margin} ${height + margin}`)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .classed('svg-content-responsive', true);


        const maxFrequency = Math.max(...Object.values(topicData));
        const words = Object.keys(topicData).filter(word => topicData[word] > 3).map(word => ({
            text: word,
            size: Math.log(topicData[word]) / Math.log(maxFrequency) * 110,
        }));

        // console.log(words);

        const layout = cloud()
            .size([width, height])
            .words(words)
            .padding(10)
            .rotate(() => (Math.random() < 0.5 ? 0 : 90)) // Rotate words randomly
            .fontSize(d => d.size)
            .on('end', draw);

        layout.start();

        function draw(words) {
            const [minX, maxX] = d3.extent(words.map(d => d.x));
            const [minY, maxY] = d3.extent(words.map(d => d.y));
            const cloudWidth = maxX - minX;
            const cloudHeight = maxY - minY;

            // Calculate the translation to center the word cloud in the SVG
            const translateX = (width - cloudWidth) / 2 - minX;
            const translateY = (height - cloudHeight) / 2 - minY;

            svg.selectAll('text')
                .data(words)
                .enter()
                .append('text')
                .style('font-size', d => `${d.size}px`)
                .style('fill', 'steelblue') // Adjust the color as needed
                .attr('text-anchor', 'middle')
                .attr('transform', d => `translate(${d.x + translateX},${d.y + translateY})rotate(${d.rotate})`)
                .text(d => d.text);
        }


    }, [topicData]);

    return (
        <div className='wordCloud relative flex flex-col gap-5 justify-between items-center bg-light-gray border rounded-3xl p-5 col-span-12 md:col-span-5'>
            <h2 className='font-semibold text-xl text-center font-montserrat'>Popular News Topics</h2>
            <svg ref={svgRef}></svg>
        </div>
    );


}