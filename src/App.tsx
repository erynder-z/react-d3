import { useState } from 'react';
import './App.css';
import { PieChart } from './charts/PieChart';
import { pieChartData } from './data/pieChartData';
import { LineChart } from './charts/LineChart';
import { lineChartData } from './data/lineChartData';
import { Histogram } from './charts/Histogram';
import { histogramData } from './data/histogramData';
import { ScatterPlot } from './charts/ScatterPlot';
import { scatterPlotData } from './data/scatterPlotData';

const App = () => {
  const [activeChart, setActiveChart] = useState<JSX.Element | null>(null);

  return (
    <main className="main">
      <h1>D3 Chart Examples</h1>
      <div className="buttonContainer">
        <button
          onClick={() => {
            setActiveChart(
              <PieChart
                width={pieChartData.width}
                height={pieChartData.height}
                data={pieChartData.data}
              />
            );
          }}
        >
          Pie Chart
        </button>
        <button
          onClick={() => {
            setActiveChart(
              <LineChart
                width={lineChartData.width}
                height={lineChartData.height}
                data={lineChartData.data}
              />
            );
          }}
        >
          Line Chart
        </button>
        <button
          onClick={() => {
            setActiveChart(
              <Histogram
                width={lineChartData.width}
                height={lineChartData.height}
                data={histogramData.data}
              />
            );
          }}
        >
          Histogram
        </button>
        <button
          onClick={() => {
            setActiveChart(
              <ScatterPlot
                width={scatterPlotData.width}
                height={scatterPlotData.height}
                data={scatterPlotData.data}
              />
            );
          }}
        >
          Scatterplot
        </button>
      </div>
      {activeChart}
    </main>
  );
};

export default App;
