import { useMemo } from 'react';
import { ScaleLinear } from 'd3';

type ScatterPlotXAxisProps = {
  xScale: ScaleLinear<number, number>;
  pixelsPerTick: number;
  height: number;
};

const TICK_LENGTH = 10;

export const ScatterPlotXAxis = ({
  xScale,
  pixelsPerTick,
  height,
}: ScatterPlotXAxisProps) => {
  const range = xScale.range(); // Get the range of the xScale

  const ticks = useMemo(() => {
    const width = range[1] - range[0]; // Calculate the width of the xScale
    const numberOfTicksTarget = Math.floor(width / pixelsPerTick); // Calculate the number of ticks based on pixel density

    // Generate an array of tick values and their x-offsets
    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value), // Calculate the x-offset based on the value
    }));
  }, [pixelsPerTick, range, xScale]);

  return (
    <>
      {ticks.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={`translate(${xOffset}, 0)`} // Translate each tick to its x position
          shapeRendering={'crispEdges'}
        >
          <line
            y1={TICK_LENGTH} // Starting y-coordinate of the tick line
            y2={-height - TICK_LENGTH} // Ending y-coordinate of the tick line (negative height)
            className="axisLine"
          />
          <text key={value} className="xAxisText">
            {value}
          </text>
        </g>
      ))}
    </>
  );
};
