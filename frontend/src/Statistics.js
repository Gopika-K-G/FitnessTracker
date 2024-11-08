import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Pie } from 'react-chartjs-2'; // Import required chart types
import { Chart, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from 'chart.js';
import html2canvas from 'html2canvas'; // Import html2canvas for capturing screenshots
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';

// Register the required components
Chart.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend); // Include ArcElement for doughnut/pie

const Statistics = ({ username }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/statistics/${username}`); // Adjust API endpoint as necessary
        const workoutData = response.data;
        setWorkouts(workoutData);

        // Calculate total calories burned
        const total = workoutData.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
        setTotalCalories(total);

        setLoading(false);
      } catch (err) {
        setError('Error fetching workouts');
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (workouts.length === 0) {
    return (
      <div className="statistics">
        <h2>Workout Statistics</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px', // Adjust height as needed
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginTop: '20px',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <p style={{ fontSize: '18px', color: '#555' }}>
            No workout data found. Enter your workouts to see your statistics.
          </p>
        </div>
      </div>
    );
  }


  // Prepare data for the bar chart
  const barChartData = {
    labels: workouts.map(workout => new Date(workout.date).toLocaleDateString()), // Dates as labels
    datasets: [
      {
        label: 'Calories Burned',
        data: workouts.map(workout => workout.caloriesBurned),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Bar chart options with axis labels
  const barChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Calories Burned',
        },
      },
    },
  };

  // Progress chart (Doughnut) data for total calories burned
  const doughnutData = {
    labels: ['Calories Burned', 'Remaining to Goal'], // Assume a target for visual representation
    datasets: [
      {
        data: [totalCalories, 1000 - totalCalories], // Assume 1000 as a target for demo purposes
        backgroundColor: ['#4caf50', '#cddc39'], // Custom colors
      },
    ],
  };

  // Pie chart data to show the division of workout types
  const workoutTypes = workouts.reduce((acc, workout) => {
    acc[workout.workoutType] = (acc[workout.workoutType] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(workoutTypes),
    datasets: [
      {
        data: Object.values(workoutTypes),
        backgroundColor: ['#f44336', '#2196f3', '#ffeb3b', '#4caf50'], // Assign colors to workout types
      },
    ],
  };

  // Pie chart options to display labels
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10, // Reduce the size of the label boxes
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = pieData.labels[tooltipItem.dataIndex] || '';
            const value = pieData.datasets[0].data[tooltipItem.dataIndex];
            return `${label}: ${value} workouts`; // Label format
          },
        },
      },
    },
  };

  // Download all charts as a single image
  const downloadChartsAsImage = () => {
    const chartsContainer = document.getElementById('charts-container');
    html2canvas(chartsContainer).then((canvas) => {
      const date = new Date().toLocaleDateString().replace(/\//g, '-'); // Format the date as dd-mm-yyyy
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = `workout-charts-${date}.png`; // Set filename with date
      link.click();
    });
  };

  return (
    <div className="statistics">
      <h2>Workout Statistics</h2>

      <button onClick={downloadChartsAsImage}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#45a049')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#4CAF50')}>Download All Graphs</button>

      <div id="charts-container">
        {/* Bar Chart for Calories Burned */}
        <div style={{ width: '80%', height: '400px', margin: 'auto', backgroundColor: 'white', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Bar data={barChartData} options={barChartOptions} />
        </div>

        {/* Flex container for Doughnut and Pie charts */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px' }}>
          {/* Doughnut Chart for Total Calories Burned */}
          <div style={{ width: '40%', backgroundColor: 'white', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h3>Total Calories Burned: {totalCalories}</h3>
            <Doughnut data={doughnutData} />
          </div>

          {/* Pie Chart for Workout Type Distribution */}
          <div style={{ width: '40%', backgroundColor: 'white', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h3>Workout Type Distribution</h3>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Social Media Share Buttons */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <h4>Share your Workout Stats:</h4>
          <FacebookShareButton url={window.location.href} quote="Check out my workout statistics!" >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={window.location.href} title="Check out my workout statistics!">
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton url={window.location.href} title="Check out my workout statistics!">
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
