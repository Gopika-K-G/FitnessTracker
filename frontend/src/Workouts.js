import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Workouts.css'; // Create this CSS file for styling

const Workouts = ({ username }) => {
  // State for workout form
  const [workoutDetails, setWorkoutDetails] = useState({
    workoutType: '',  // Define initial values for controlled inputs
    date: '',
    startTime: '',
    endTime: '',
    intensity: '',
  });

  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [weight, setWeight] = useState(0);
  const [weightUnit, setWeightUnit] = useState('kg'); // Default weight unit

  const MET_VALUES = {
    // Cardio Workouts
    'Running': 9,
    'Cycling': 8,
    'Walking': 3.5,
    'Jogging': 7,
    'Skipping': 8,
    'Swimming': 7,
    'Hiking': 6,
    'Treadmill': 6,
    'Rowing': 6,
    'Elliptical': 6,
    'Stair Climbing': 8,
    'Dance Aerobics': 6,
    'Zumba': 6,
  
    // Strength Training
    'Weightlifting': 6,
    'Bodyweight Exercises': 4,
    'Resistance Band Workouts': 3,
    'CrossFit': 8,
    'Powerlifting': 6,
    'Kettlebell Workouts': 6,
  
    // Upper Body Workouts
    'Push-ups': 4,
    'Pull-ups': 6,
    'Bench Press': 6,
    'Shoulder Press': 6,
    'Bicep Curls': 4,
    'Tricep Dips': 4,
    'Lat Pulldown': 5,
    'Dumbbell Flyes': 4,
    'Arnold Press': 5,
  
    // Lower Body Workouts
    'Squats': 5,
    'Lunges': 5,
    'Deadlifts': 6,
    'Leg Press': 5,
    'Calf Raises': 4,
    'Hamstring Curls': 4,
    'Step-ups': 5,
  
    // Core Workouts
    'Plank': 4,
    'Crunches': 4,
    'Russian Twists': 5,
    'Leg Raises': 4,
    'Mountain Climbers': 6,
    'Sit-ups': 4,
    'Bicycle Crunches': 5,
  
    // Flexibility & Balance
    'Yoga': 2.5,
    'Pilates': 3,
    'Stretching': 2.5,
    'Tai Chi': 3,
    'Balance Training': 3.5,
  
    // Sports
    'Basketball': 8,
    'Football': 8,
    'Soccer': 7,
    'Tennis': 6,
    'Badminton': 6,
    'Cricket': 5,
    'Rugby': 7,
    'Volleyball': 3.5,
  };
  

  // Fetch user's weight and weight unit using the username
  useEffect(() => {
    const fetchUserWeight = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${username}`);
        setWeight(response.data.weight || 0); // Avoid undefined values
        setWeightUnit(response.data.weightUnit || 'kg');
      } catch (error) {
        console.error('Error fetching user weight:', error);
      }
    };

    if (username) {
      fetchUserWeight(); // Fetch only if username is available
    }
  }, [username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorkoutDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const calculateCaloriesBurned = (metValue, weight, workoutDetails) => {
    const weightInKg = weightUnit === 'lbs' ? weight / 2.205 : weight;
    const durationInHours = calculateDuration(workoutDetails.startTime, workoutDetails.endTime) / 60; // Convert minutes to hours
    const calories = Math.round(metValue * weightInKg * durationInHours);
    return calories;
  };

  // Function to calculate the workout duration
  const calculateDuration = (start, end) => {
    const startTime = new Date(`01/01/2020 ${start}`);
    const endTime = new Date(`01/01/2020 ${end}`);
    const duration = (endTime - startTime) / (1000 * 60); // Calculate duration in minutes
    return duration > 0 ? duration : 0; // Prevent negative durations
  };

  // Function to handle form submission
  // Function to handle form submission
const handleSubmit = async (e) => {
    e.preventDefault();
    const metValue = MET_VALUES[workoutDetails.workoutType];

    // Log the workout details for debugging
    console.log("Workout Details:", workoutDetails);
    console.log("MET Value:", metValue);
    console.log("Weight:", weight);
    
    // Check that all required fields are filled
    if (metValue && workoutDetails.workoutType && workoutDetails.startTime && workoutDetails.endTime && workoutDetails.date) {
        const calories = calculateCaloriesBurned(metValue, weight, workoutDetails);
        setCaloriesBurned(calories);

        // Prepare the data to send to the server
        const workoutData = {
            username,
            workoutType: workoutDetails.workoutType,
            duration: calculateDuration(workoutDetails.startTime, workoutDetails.endTime) / 60,
            date: workoutDetails.date,
            caloriesBurned: calories
        };

        try {
            // Send the workout data to the server using POST
            const response = await axios.post('http://localhost:5000/api/workout', workoutData);
            console.log('Workout saved:', response.data);

            // Clear the form after submission
            setWorkoutDetails({
                workoutType: '',
                date: '',
                startTime: '',
                endTime: '',
                intensity: '',
            });
        } catch (error) {
            console.error('Error saving workout:', error);
        }
    } else {
        alert('Please fill all required fields.'); // Alert if not all fields are filled
    }
};

  
  return (
    <div className="workouts-content">
      <h2>Enter Workout Details</h2>
      <form onSubmit={handleSubmit} className="workout-form">
        <label>
          Workout Type:
          <select
            name="workoutType"
            value={workoutDetails.workoutType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a workout</option>

            {/* General Workouts */}
            <optgroup label="General Workouts">
              <option value="Cycling">Cycling</option>
              <option value="Walking">Walking</option>
              <option value="Jogging">Jogging</option>
              <option value="Skipping">Skipping</option>
              <option value="Swimming">Swimming</option>
              <option value="Hiking">Hiking</option>
              <option value="Running">Running</option>
            </optgroup>

            {/* Strength Training */}
            <optgroup label="Strength Training">
              <option value="Weightlifting">Weightlifting</option>
              <option value="Bodyweight Exercises">Bodyweight Exercises</option>
              <option value="Resistance Band Workouts">Resistance Band Workouts</option>
              <option value="CrossFit">CrossFit</option>
              <option value="Powerlifting">Powerlifting</option>
              <option value="Kettlebell Workouts">Kettlebell Workouts</option>
            </optgroup>

            {/* Upper Body Workouts */}
            <optgroup label="Upper Body Workouts">
              <option value="Push-ups">Push-ups</option>
              <option value="Pull-ups">Pull-ups</option>
              <option value="Bench Press">Bench Press</option>
              <option value="Shoulder Press">Shoulder Press</option>
              <option value="Bicep Curls">Bicep Curls</option>
              <option value="Tricep Dips">Tricep Dips</option>
              <option value="Lat Pulldown">Lat Pulldown</option>
              <option value="Dumbbell Flyes">Dumbbell Flyes</option>
              <option value="Arnold Press">Arnold Press</option>
            </optgroup>

            {/* Lower Body Workouts */}
            <optgroup label="Lower Body Workouts">
              <option value="Squats">Squats</option>
              <option value="Lunges">Lunges</option>
              <option value="Deadlifts">Deadlifts</option>
              <option value="Leg Press">Leg Press</option>
              <option value="Calf Raises">Calf Raises</option>
              <option value="Hamstring Curls">Hamstring Curls</option>
              <option value="Step-ups">Step-ups</option>
            </optgroup>

            {/* Core Workouts */}
            <optgroup label="Core Workouts">
              <option value="Plank">Plank</option>
              <option value="Crunches">Crunches</option>
              <option value="Russian Twists">Russian Twists</option>
              <option value="Leg Raises">Leg Raises</option>
              <option value="Mountain Climbers">Mountain Climbers</option>
              <option value="Sit-ups">Sit-ups</option>
              <option value="Bicycle Crunches">Bicycle Crunches</option>
            </optgroup>

            {/* Cardio Workouts */}
            <optgroup label="Cardio Workouts">
              <option value="Treadmill">Treadmill</option>
              <option value="Rowing">Rowing</option>
              <option value="Elliptical">Elliptical</option>
              <option value="Stair Climbing">Stair Climbing</option>
              <option value="Dance Aerobics">Dance Aerobics</option>
              <option value="Zumba">Zumba</option>
            </optgroup>

            {/* Flexibility & Balance */}
            <optgroup label="Flexibility & Balance">
              <option value="Yoga">Yoga</option>
              <option value="Pilates">Pilates</option>
              <option value="Stretching">Stretching</option>
              <option value="Tai Chi">Tai Chi</option>
              <option value="Balance Training">Balance Training</option>
            </optgroup>

            {/* Sports */}
            <optgroup label="Sports">
              <option value="Basketball">Basketball</option>
              <option value="Football">Football</option>
              <option value="Soccer">Soccer</option>
              <option value="Tennis">Tennis</option>
              <option value="Badminton">Badminton</option>
              <option value="Cricket">Cricket</option>
              <option value="Rugby">Rugby</option>
              <option value="Volleyball">Volleyball</option>
            </optgroup>
          </select>
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={workoutDetails.date}
            onChange={handleInputChange}
            required
          />
        </label>
        {/* Flexbox Container for Start and End Time */}
        <div className="time-container">
          <label>
            Start Time:
            <input
              type="time"
              name="startTime"
              value={workoutDetails.startTime}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            End Time:
            <input
              type="time"
              name="endTime"
              value={workoutDetails.endTime}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <label>
          Intensity:
          <select
            name="intensity"
            value={workoutDetails.intensity}
            onChange={handleInputChange}
            required
          >
            <option value="">Select intensity</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>

      {caloriesBurned > 0 && (
        <div className="calories-result">
          <h3>Calories Burned: {caloriesBurned}</h3>
        </div>
      )}
    </div>
  );
};

export default Workouts;
