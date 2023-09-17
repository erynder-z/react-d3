import * as d3 from 'd3';
import { ScatterPlotYAxis } from './ScatterPlotYAxis';
import { ScatterPlotXAxis } from './ScatterPlotXAxis';

type ScatterPlotProps = {
  width: number;
  height: number;
  data: { x: number; y: number }[];
};

const MARGIN = { top: 60, right: 60, bottom: 60, left: 60 };

export const ScatterPlot = ({ width, height, data }: ScatterPlotProps) => {
  // Layout. The div size is set by the given props.
  // The bounds (=area inside the axis) is calculated by subtracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Scales
  const yScale = d3.scaleLinear().domain([0, 10]).range([boundsHeight, 0]);
  const xScale = d3.scaleLinear().domain([0, 10]).range([0, boundsWidth]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
    return (
      <circle
        key={i}
        r={13}
        cx={xScale(d.y)}
        cy={yScale(d.x)}
        className="circles"
      />
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        <g
          className="scatterPlot"
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
          {/* Y axis */}
          <ScatterPlotYAxis
            yScale={yScale}
            pixelsPerTick={40}
            width={boundsWidth}
          />

          {/* X axis, use an additional translation to appear at the bottom */}
          <g transform={`translate(0, ${boundsHeight})`}>
            <ScatterPlotXAxis
              xScale={xScale}
              pixelsPerTick={40}
              height={boundsHeight}
            />
          </g>

          {/* Circles */}
          {allShapes}
        </g>
      </svg>
    </div>
  );
};
