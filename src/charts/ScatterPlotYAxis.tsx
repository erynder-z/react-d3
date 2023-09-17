import { useMemo } from 'react';
import { ScaleLinear } from 'd3';

type ScatterPlotYAxisProps = {
  yScale: ScaleLinear<number, number>; // The yScale passed from the parent component
  pixelsPerTick: number; // Number of pixels per tick
  width: number; // Width of the Y-axis
};

const TICK_LENGTH = 10; // Length of tick marks

export const ScatterPlotYAxis = ({
  yScale,
  pixelsPerTick,
  width,
}: ScatterPlotYAxisProps) => {
  const range = yScale.range(); // Get the range of the yScale

  const ticks = useMemo(() => {
    const height = range[0] - range[1]; // Calculate the height of the yScale
    const numberOfTicksTarget = Math.floor(height / pixelsPerTick); // Calculate the number of ticks based on pixel density

    // Generate an array of tick values and their y-offsets
    return yScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      yOffset: yScale(value), // Calculate the y-offset based on the value
    }));
  }, [pixelsPerTick, range, yScale]);

  return (
    <>
      {ticks.map(({ value, yOffset }) => (
        <g
          key={value}
          transform={`translate(0, ${yOffset})`} // Translate each tick to its y position
          shapeRendering={'crispEdges'} // Set the shape rendering style
        >
          <line
            x1={-TICK_LENGTH} // Starting x-coordinate of the tick line (negative)
            x2={width + TICK_LENGTH} // Ending x-coordinate of the tick line
            className="axisLine"
          />
          <text key={value} className="yAxisText">
            {value}
          </text>
        </g>
      ))}
    </>
  );
};
