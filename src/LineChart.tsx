import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';

type DataItem = {
  x: number;
  y: number;
};
type LineChartProps = {
  width: number;
  height: number;
  data: DataItem[];
};

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

export const LineChart = ({ width, height, data }: LineChartProps) => {
  // Ref to the SVG element for axes
  const axesRef = useRef<SVGSVGElement | null>(null);

  // Calculate bounds dimensions
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Compute the yScale for data
  const [min, max] = d3.extent(data, (d) => d.y);
  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      .range([boundsHeight, 0]);
  }, [boundsHeight, max]);

  // Compute the xScale for data
  const [xMin, xMax] = d3.extent(data, (d) => d.x);
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, xMax || 0])
      .range([0, boundsWidth]);
  }, [boundsWidth, xMax]);

  // Create the axes using useEffect
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll('*').remove();

    // X-axis
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append('g')
      .attr('transform', `translate(0, ${boundsHeight})`)
      .call(xAxisGenerator);

    // Y-axis
    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append('g').call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  // Create the line path
  const lineBuilder = d3
    .line<DataItem>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));
  const linePath = lineBuilder(data) ?? '';

  // Return the line chart
  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
          {/* Line path */}
          <path d={linePath} opacity={1} className="graph" strokeWidth={2} />
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        />
      </svg>
    </div>
  );
};
