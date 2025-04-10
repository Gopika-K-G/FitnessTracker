const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // For password hashing

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://Gopika:Gopi%40mongo08@cluster1.9nhsgpp.mongodb.net/Fitness?retryWrites=true&w=majority&appName=Cluster1';

// Middleware
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Mongoose schema and model for users
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true }, // Store hashed password
  age: { type: Number, required: false },
  height: { type: Number, required: false },
  heightUnit: { type: String, required: false },
  weight: { type: Number, required: false },
  weightUnit: { type: String, required: false },
  role: { type: String, enum: ['user'], default: 'user' }, // Default role for users
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Route to handle profile update
app.put('/api/updateProfile', async (req, res) => {
  const { username, fullName, email, phoneNumber, age, height, weight, newUsername } = req.body;

  try {
    // Check if the new username already exists (except for the current user)
    if (newUsername && newUsername !== username) {
      const existingUser = await User.findOne({ username: newUsername });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken. Please choose a different one.' });
      }
    }

    // Update the user profile, keeping the current username if not changed
    const user = await User.findOneAndUpdate(
      { username }, // Find the user by current username
      { fullName, email, phoneNumber, age, height, weight, username: newUsername || username }, // Update fields, use newUsername if provided
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err });
  }
});

// API endpoint to get user profile by username
app.get('/api/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user profile data as response
    res.status(200).json({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      age: user.age,
      height: user.height,
      heightUnit: user.heightUnit,
      weight: user.weight,
      weightUnit: user.weightUnit,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Signup Route for Users (No admin registration)
app.post('/api/signup', async (req, res) => {
  const { fullName, username, email, phoneNumber, password, age,height, heightUnit, weight, weightUnit } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user object
    const newUser = new User({
      fullName,
      username,
      email,
      phoneNumber,
      password: hashedPassword, // Save hashed password
      age,
      height,
      heightUnit,
      weight,
      weightUnit,
      role: 'user', // Default role
    });

    // Save the user in the database
    const savedUser = await newUser.save();

    res.status(201).json({ success: true, userId: savedUser._id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login Route for Users and Admins
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user in the users collection
    let user = await User.findOne({ email });
    if (!user) {
      // If not found, check in the admins collection
      user = await mongoose.connection.collection('admins').findOne({ email });
    }

    // If neither user nor admin was found
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      role: user.role || 'admin', // Will be 'user' or 'admin' depending on where they were found
      username: user.username, // Ensure username is included here
      userId: user._id, // Optionally include the user ID
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user data back to the client
    res.json({
      username: user.username,
      weight: user.weight,
      weightUnit: user.weightUnit,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const workoutSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Store the username associated with the workout
  workoutType: { type: String, required: true },
  duration: { type: Number, required: true }, // Duration in minutes
  date: { type: Date, default: Date.now },
  caloriesBurned: { type: Number, required: true }

});

// Create the Workout model
const Workout = mongoose.model('Workout', workoutSchema);

// Route to create a new workout
app.post('/api/workout', async (req, res) => {
  const { username, workoutType, duration, date,caloriesBurned } = req.body;

  try {
    // Create a new workout object with the username
    const newWorkout = new Workout({
      username, // Add the username to the workout data
      workoutType,
      duration,
      date,
      caloriesBurned
    });

    // Save the workout in the database
    const savedWorkout = await newWorkout.save();

    res.status(201).json({ success: true, workout: savedWorkout });
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// In your Express server file
app.get('/api/statistics/:username', async (req, res) => {
  const { username } = req.params;  // Corrected to use req.params instead of req.query
  try {
    // Fetch workouts based on the username
    const workouts = await Workout.find({ username });

    if (!workouts.length) {
      return res.status(404).json({ message: 'No workouts found for this user' });
    }

    // Return the fetched workouts
    res.json(workouts);
    console.log(workouts);  // Log the workouts array, not res.data
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ message: 'Error fetching workouts' });
  }
});

const userGoalSchema = new mongoose.Schema({
  username: { type: String, required: true },
  caloriesToBurn: { type: Number, required: true },
  duration: { type: Number, required: true },
  durationUnit: { type: String, required: true } // e.g., "minutes", "hours", etc.
});

const UserGoal = mongoose.model('UserGoal', userGoalSchema, 'user_goal'); 

app.post('/api/user-goal', async (req, res) => {
  const { username, caloriesToBurn, duration, durationUnit } = req.body;

  try {
      const userGoal = new UserGoal({ username, caloriesToBurn, duration, durationUnit });
      await userGoal.save();
      res.status(201).json({ message: 'User goal saved successfully!' });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Define Mongoose schema and model for food items
const foodItemSchema = new mongoose.Schema({
  food_code: String,
  food_name: String,
  energy_kj: Number,
  energy_kcal: Number,
  carb_g: Number,
  protein_g: Number,
  fat_g: Number,
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema, 'food');

// Route to search food items
app.get('/api/foods', async (req, res) => {
  const searchTerm = req.query.searchTerm;

  try {
    const foodItems = await FoodItem.find(
      { food_name: { $regex: searchTerm, $options: 'i' } },
      { food_code: 1, food_name: 1, energy_kj: 1, energy_kcal: 1, carb_g: 1, protein_g: 1, fat_g: 1 }
    );

    res.json(foodItems);
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ error: "An error occurred while fetching food items." });
  }
});



const foodSchema = new mongoose.Schema({
  food_code: String,
  food_name: String,
  protein_category: String,
  carb_category: String,
  fat_category: String,
  fiber_category: String,
  vitamin_category: String,
  macro_content_category: String,
  fitness_goal: String,
  muscle_building_rank: Number,
  weight_loss_rank: Number,
  weight_maintenance_rank: Number,
  endurance_building_rank: Number
});

const Food = mongoose.model('Food', foodSchema,'food_sugg');

app.get('/api/recommend-foods', async (req, res) => {
  const { activeLevel, fitnessGoal } = req.query;

  // Determine ranking field based on fitness goal
  const rankField = {
      'Muscle Building': 'muscle_building_rank',
      'Weight Loss': 'weight_loss_rank',
      'Weight Maintenance': 'weight_maintenance_rank',
      'Endurance Building': 'endurance_building_rank'
  }[fitnessGoal];

  if (!rankField) {
    return res.status(400).json({ error: "Invalid fitness goal" });
  }

  try {
      // Find and sort foods based on the fitness goal rank, then limit to top 10
      const recommendedFoods = await Food.find({ fitness_goal: fitnessGoal })
          .sort({ [rankField]: 1 })
          

      res.json(recommendedFoods);
  } catch (err) {
      console.error("Error fetching food recommendations:", err);
      res.status(500).json({ error: "Failed to fetch food recommendations" });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
