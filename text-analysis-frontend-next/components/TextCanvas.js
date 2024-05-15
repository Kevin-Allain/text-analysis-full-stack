import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import Navbar from "@/components/NavBar";

function TextCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = 1000;
        canvas.height = 100;

        const text = "Here is a simple example where each word will have a background color based on its length and some will have borders.";
        ctx.font = '16px Arial';
        ctx.textBaseline = 'top';

        const charPositions = [];
        let offsetX = 10;
        let offsetY = 50;

        // Calculate position for each character
        for (const char of text) {
            const charWidth = ctx.measureText(char).width;
            charPositions.push({ char, offsetX, offsetY, width: charWidth });
            offsetX += charWidth;
        }

        // Function to draw a segment with background and optional border
        function drawSegment(startIndex, endIndex, backgroundColor, hasBorder) {
            const segment = charPositions.slice(startIndex, endIndex + 1);
            const startX = segment[0].offsetX;
            const endX = segment[segment.length - 1].offsetX + segment[segment.length - 1].width;

            // Draw background
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(startX, offsetY, endX - startX, 24);

            // Draw border if needed
            if (hasBorder) {
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.strokeRect(startX, offsetY, endX - startX, 24);
            }

            // Redraw text on top
            segment.forEach(({ char, offsetX }) => {
                ctx.fillStyle = 'white';
                ctx.fillText(char, offsetX, offsetY + 2);
            });
        }

        // Example: Randomly highlight segments
        const numSegments = 5;
        for (let i = 0; i < numSegments; i++) {
            const start = Math.floor(Math.random() * charPositions.length);
            const end = Math.min(start + Math.floor(Math.random() * 20), charPositions.length - 1);
            const backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
            drawSegment(start, end, backgroundColor, Math.random() > 0.5);
        }
    }, []);

    return (
        <>
            <canvas ref={canvasRef} style={{ border: '1px solid black' }}></canvas>
        </>
    );
}

export default TextCanvas;
