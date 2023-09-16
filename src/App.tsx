import { useState } from 'react';
import './App.css';
import { PieChart } from './PieChart';
import { pieChartData } from './data/piechartData';
import { LineChart } from './LineChart';
import { lineChartData } from './data/linechartData';

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
      </div>
      {activeChart}
    </main>
  );
};

export default App;
