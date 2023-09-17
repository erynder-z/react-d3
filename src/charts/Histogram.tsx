import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';

type HistogramProps = {
  width: number;
  height: number;
  data: number[];
};

// Define default values for margin and bucket padding
const MARGIN = { top: 30, right: 30, bottom: 40, left: 50 };
const BUCKET_NUMBER = 70;
const BUCKET_PADDING = 1;

export const Histogram = ({ width, height, data }: HistogramProps) => {
  // Create a reference to the SVG element
  const axesRef = useRef<SVGSVGElement | null>(null);

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Calculate the bounds of the chart area
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Create an xScale for mapping data to the x-axis
  const xScale = useMemo(() => {
    // Calculate the maximum value in the data
    const max = Math.max(...data);

    // Set a maximum limit for the xScale
    const limitedMaximum = 1000;

    return d3
      .scaleLinear()
      .domain([0, limitedMaximum] as [number, number]) // Define the domain
      .range([10, boundsWidth]); // Define the range
  }, [boundsWidth, data]);

  // Create an array of data buckets using d3's bin function
  const buckets = useMemo(() => {
    const bucketGenerator = d3
      .bin()
      .value((d) => d) // Access the data values
      .domain(xScale.domain() as [number, number]) // Set the domain based on xScale
      .thresholds(xScale.ticks(BUCKET_NUMBER) as number[]); // Determine bucket thresholds
    return bucketGenerator(data);
  }, [data, xScale]);

  // Create a yScale for mapping data to the y-axis
  const yScale = useMemo(() => {
    // Calculate the maximum bucket length (frequency)
    const max = Math.max(...buckets.map((bucket) => bucket?.length));

    return d3
      .scaleLinear()
      .range([boundsHeight, 0]) // Define the range for the y-axis
      .domain([0, max]) // Set the domain based on the maximum bucket length
      .nice(); // Make the scale "nice" for better readability
  }, [boundsHeight, buckets]);

  // Render the X and Y axes using d3.js, not React
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll('*').remove();

    // Create and render the X-axis
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append('g')
      .attr('transform', `translate(0, ${boundsHeight})`) // Position the X-axis at the bottom
      .call(xAxisGenerator);

    // Create and render the Y-axis
    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append('g').call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  // Create rectangles for the histogram bars
  const allRects = buckets.map((bucket, i) => {
    // Get the length (frequency) of the current bucket, default to 0 if undefined
    const bucketLength = bucket.length || 0;

    return (
      <rect
        key={i}
        className={`bar ${i === hoveredBar ? 'hasHighlight' : ''}`}
        x={xScale(bucket.x0 as number) + BUCKET_PADDING / 2} // Calculate x position
        width={
          xScale(bucket.x1 as number) -
          xScale(bucket.x0 as number) -
          BUCKET_PADDING
        } // Calculate width of the bar
        y={yScale(bucketLength)} // Calculate y position
        height={boundsHeight - yScale(bucketLength)} // Calculate height of the bar
        onMouseEnter={() => setHoveredBar(i)}
        onMouseLeave={() => setHoveredBar(null)}
      />
    );
  });

  // Render the entire histogram within an SVG element
  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        className="histogram"
        transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`} // Translate the chart area
      >
        {allRects}
      </g>
      <g
        width={boundsWidth}
        height={boundsHeight}
        ref={axesRef}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`} // Translate the axes area
      />
      {/* Display the value of the hovered bar */}
      {hoveredBar !== null && (
        <text x={width - 10} y={20} className="histogramHighlightText">
          {buckets[hoveredBar].length}
        </text>
      )}
    </svg>
  );
};
