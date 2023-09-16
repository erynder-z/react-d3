import { useMemo, useRef } from 'react';
import * as d3 from 'd3';
import './charts.css';
import { useDimensions } from './useDimensions';

type DataItem = {
  name: string;
  value: number;
};
type PieChartProps = {
  width: number;
  height: number;
  data: DataItem[];
};

// Define constants for margin and label extension
const MARGIN_X = 150;
const MARGIN_Y = 50;
const LABEL_EXTENSION = 20;

// Create a color scale for the pie chart using D3's color schemes
const colorScale = d3.scaleOrdinal<string>().range(d3.schemeCategory10);

export const PieChart = ({ width, height, data }: PieChartProps) => {
  // Create refs for the SVG element and the wrapper div
  const svgRef = useRef<SVGGElement | null>(null);
  const wrapperDivRef = useRef<HTMLDivElement | null>(null);

  // Use a custom hook to get dimensions of the wrapper div
  const dimensions = useDimensions(wrapperDivRef);

  // Calculate chart width and height based on dimensions and provided width/height props
  const chartWidth = dimensions.width || width;
  const chartHeight = dimensions.height || height;

  // Calculate the radius and inner radius of the pie chart
  const radius =
    Math.min(chartWidth - 2 * MARGIN_X, chartHeight - 2 * MARGIN_Y) / 2;
  const innerRadius = radius * 0.6;

  // Use useMemo to generate the pie chart data based on the input data
  const pieData = useMemo(() => {
    const pieGenerator = d3.pie<DataItem>().value((d) => d.value);
    return pieGenerator(data);
  }, [data]);

  // Create an arc generator for drawing the pie slices
  const arcGenerator = d3.arc();

  // Create an array of pie slices with labels and interaction handlers
  const pieSlices = pieData.map((slice, index) => {
    // Define the slice's inner and outer radius, start and end angles
    const sliceInfo = {
      innerRadius,
      outerRadius: radius,
      startAngle: slice.startAngle,
      endAngle: slice.endAngle,
    };

    // Calculate the centroid and path for the slice
    const centroid = arcGenerator.centroid(sliceInfo);
    const slicePath = arcGenerator(sliceInfo);

    // Define the inner and outer radius, start and end angles for label extension line
    const labelExtensionInfo = {
      innerRadius: radius + LABEL_EXTENSION,
      outerRadius: radius + LABEL_EXTENSION,
      startAngle: slice.startAngle,
      endAngle: slice.endAngle,
    };

    // Calculate the position for the label extension point
    const labelExtensionPoint = arcGenerator.centroid(labelExtensionInfo);

    // Determine label position and text anchor based on the extension point
    const isRightLabel = labelExtensionPoint[0] > 0;
    const labelPosX = labelExtensionPoint[0] + 50 * (isRightLabel ? 1 : -1);
    const textAnchor = isRightLabel ? 'start' : 'end';

    // Create label text with data and value
    const labelText = slice.data.name + ' (' + slice.value + ')';

    return (
      <g
        key={index}
        className="slice"
        onMouseEnter={() => {
          if (svgRef.current) {
            svgRef.current.classList.add('hasHighlight');
          }
        }}
        onMouseLeave={() => {
          if (svgRef.current) {
            svgRef.current.classList.remove('hasHighlight');
          }
        }}
      >
        <path d={String(slicePath)} fill={colorScale(index.toString())} />
        <circle cx={centroid[0]} cy={centroid[1]} r={2} />
        <line
          x1={centroid[0]}
          y1={centroid[1]}
          x2={labelExtensionPoint[0]}
          y2={labelExtensionPoint[1]}
          className="legend"
        />
        <line
          x1={labelExtensionPoint[0]}
          y1={labelExtensionPoint[1]}
          x2={labelPosX}
          y2={labelExtensionPoint[1]}
          className="legend"
        />
        <text
          x={labelPosX + (isRightLabel ? 2 : -2)}
          y={labelExtensionPoint[1]}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fontSize={14}
          className="legend"
        >
          {labelText}
        </text>
      </g>
    );
  });

  // Return the pie chart within a wrapper div and an SVG element
  return (
    <div ref={wrapperDivRef} className="chart-container">
      <svg
        width={chartWidth}
        height={chartHeight}
        style={{ display: 'inline-block' }}
      >
        <g
          transform={`translate(${chartWidth / 2}, ${chartHeight / 2})`}
          className="container"
          ref={svgRef}
        >
          {pieSlices}
        </g>
      </svg>
    </div>
  );
};
