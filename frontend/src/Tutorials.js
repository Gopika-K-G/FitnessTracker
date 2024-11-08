import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tutorials.css';
const YOUTUBE_API_KEY = 'AIzaSyDDz5BgAGUmQpDTzBziadfR6MXaSY2XH8A'; // Replace with your actual YouTube API key

const Tutorials = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('yoga fitness workout'); // Updated default search term
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch videos from YouTube API
  const fetchVideos = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}+yoga+fitness+workout&type=video&key=${YOUTUBE_API_KEY}`
      );
      setVideos(response.data.items);
    } catch (error) {
      setError('Failed to fetch videos. Please try again later.');
    }
    
    setLoading(false);
  };

  // UseEffect to fetch default videos on component mount or when searchTerm changes
  useEffect(() => {
    fetchVideos(searchTerm);
  }, [searchTerm]); // Adding searchTerm as a dependency

  // Handle search when user submits the search form
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchVideos(searchTerm);
    }
  };

  return (
    <div className="tutorials">
      <h2>Yoga & Fitness Tutorials</h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a workout..."
        />
        <button type="submit">Search</button>
      </form>

      {/* Show loading state */}
      {loading && <p>Loading...</p>}

      {/* Show error message if any */}
      {error && <p>{error}</p>}

      {/* Display list of videos */}
      <div className="video-list">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video.id.videoId} className="video-item">
              <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                <h3>{video.snippet.title}</h3>
              </a>
            </div>
          ))
        ) : (
          <p>No videos found</p>
        )}
      </div>
    </div>
  );
};

export default Tutorials;
