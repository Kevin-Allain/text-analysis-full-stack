import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function InteractiveSVGWithD3() {
    const ref = useRef(null);
    useEffect(() => {
        const svg = d3.select(ref.current);
        const data = [{ text: "D3.js Text", x: 50, y: 50 }];
        // Bind data to text elements
        const texts = svg.selectAll('text')
            .data(data, (d) => d.text);  // Key function for object constancy

        // Enter selection: Create new text elements as needed
        texts.enter()
            .append('text')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('font-size', '20px')
            .attr('fill', 'red')
            .style('cursor', 'pointer')
            .text(d => d.text)  // Set the text from data
            .on('click', function(event, d) {  // Correctly handle the click event
                alert(`Clicked on text: ${d.text}`);
            });
        // Update selection: Update existing elements
        texts.attr('x', d => d.x)
            .attr('y', d => d.y)
            .text(d => d.text);

        // Exit selection: Remove elements that no longer have associated data
        texts.exit().remove();
    }, []);

    return (
        <svg ref={ref} width="800" height="200" style={{ border: '1px solid black' }} />
    );
}

export default InteractiveSVGWithD3;
