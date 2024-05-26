import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScatterPlot from './components/ScatterPlot';
import PieChart from './components/Piechart'
import BubbleChart from './components/Bubblemap'
import WordChart from './components/Wordchart'
import LineChart from './components/Linechart'


function App() {
  const [news, setNews] = useState([]);

  // For local: comment below out

  // For deployment
  axios.defaults.withCredentials=true;

  useEffect(() => {
    // Fetch Data from server
    const getData = async () =>{
      // For local
      // await axios.get('http://localhost:8080/')

      // For deploymenent
      await axios.get('https://news-dashboard-backend.vercel.app/')
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
      <h1 className='text-center md:text-left font-light text-5xl m-5'>News Data Analysis</h1>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-7wxl mx-auto p-[5%] group">

        <BubbleChart newsData={news} />
        <WordChart newsData={news} />
        <PieChart newsData={news} />
        <ScatterPlot newsData={news}/>
        <LineChart newsData={news} />

      </section>


      </div>

  );
}

export default App;
