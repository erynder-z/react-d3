import './App.css';
import { PieChart } from './PieChart';

function App() {
  const width = 700;
  const height = 400;
  const data = [
    { name: 'A', value: 62 },
    { name: 'B', value: 15 },
    { name: 'C', value: 39 },
    { name: 'D', value: 69 },
    { name: 'E', value: 98 },
  ];

  return (
    <>
      <h1>D3 Chart Example</h1>
      <PieChart width={width} height={height} data={data} />
    </>
  );
}

export default App;
