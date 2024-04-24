import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScatterPlot from './components/ScatterPlot';
import PieChart from './components/Piechart'
import BubbleChart from './components/Bubblemap'
import WordChart from './components/Wordchart'
import LineChart from './components/Linechart'


function App() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch Data from server
    const getData = async () =>{
      await axios.get('https://news-dashboard-sigma.vercel.app/news')
        .then(response => {
          setNews(response.data);
        }).catch(error => {
          console.error("Error fetching data:", error);
        });
  }
    getData();
  },[]);
  
  return(
    <div>
      <h1 className='center'>NEWS DASHBOARD</h1>

      <BubbleChart newsData={news} />
      <WordChart newsData={news} />
      <PieChart newsData={news} />
      <ScatterPlot newsData={news}/>
      <LineChart newsData={news} />

    </div>

  );
}

export default App;
