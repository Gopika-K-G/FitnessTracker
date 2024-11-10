import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function DietPlan({ username }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [error, setError] = useState('');
    const [activeLevel, setActiveLevel] = useState('');
    const [fitnessGoal, setFitnessGoal] = useState('');
    const [recommendations, setRecommendations] = useState([]);

    const handleSearchChange = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setError('');

        if (term) {
            try {
                const response = await axios.get(`https://fitnesstracker-6y74.onrender.com/api/foods?searchTerm=${term}`);
                setSuggestions(response.data);
            } catch (err) {
                console.error("Error fetching food suggestions:", err);
                setError("Could not retrieve food suggestions. Please try again later.");
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (food) => {
        setSelectedFood(food);
        setSearchTerm(food.food_name);
        setSuggestions([]);
    };

    const fetchRecommendations = useCallback(async () => {
        try {
            const response = await axios.get('https://fitnesstracker-6y74.onrender.com/api/recommend-foods', {
                params: { activeLevel, fitnessGoal }
            });
            setRecommendations(response.data);
        } catch (err) {
            console.error("Error fetching recommendations:", err);
            setError("Failed to load food recommendations.");
        }
    }, [activeLevel, fitnessGoal]);

    useEffect(() => {
        if (fitnessGoal && activeLevel) {
            fetchRecommendations();
        }
    }, [activeLevel, fitnessGoal, fetchRecommendations]);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Diet Plan</h2>

            {/* Food Search Section */}
            <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: '#f7f9fa',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{ color: '#2980b9' }}>Search for Nutritional Information</h3>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Enter food name"
                    style={{
                        width: '100%',
                        padding: '12px',
                        margin: '10px 0',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '1rem'
                    }}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{
                    maxHeight: '150px',
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#fafafa',
                    marginTop: '10px'
                }}>
                    {suggestions.map((food) => (
                        <div
                            key={food.food_code}
                            onClick={() => handleSuggestionClick(food)}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #eee',
                                backgroundColor: '#fff',
                                transition: 'background-color 0.2s',
                                textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9f5ff'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                        >
                            {food.food_name}
                        </div>
                    ))}
                </div>
                {selectedFood && (
                    <div style={{ marginTop: '20px', textAlign: 'left' }}>
                        <h4 style={{ color: '#16a085' }}>Nutrition Information for {selectedFood.food_name}</h4>
                        <p><strong>Energy (kJ):</strong> {selectedFood.energy_kj}</p>
                        <p><strong>Energy (kcal):</strong> {selectedFood.energy_kcal}</p>
                        <p><strong>Carbohydrates (g):</strong> {selectedFood.carb_g}</p>
                        <p><strong>Protein (g):</strong> {selectedFood.protein_g}</p>
                        <p><strong>Fat (g):</strong> {selectedFood.fat_g}</p>
                    </div>
                )}
            </div>

            {/* Food Recommendation Section */}
            <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{ color: '#2980b9' }}>Personalized Food Recommendations</h3>
                <label style={{ display: 'block', marginBottom: '10px', color: '#34495e' }}>
                    Activity Level:
                    <select
                        value={activeLevel}
                        onChange={(e) => setActiveLevel(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            marginTop: '5px'
                        }}
                    >
                        <option value="">Select activity level</option>
                        <option value="Sedentary">Sedentary</option>
                        <option value="Lightly Active">Lightly Active</option>
                        <option value="Moderately Active">Moderately Active</option>
                        <option value="Very Active">Very Active</option>
                    </select>
                </label>

                <label style={{ display: 'block', marginBottom: '20px', color: '#34495e' }}>
                    Fitness Goal:
                    <select
                        value={fitnessGoal}
                        onChange={(e) => setFitnessGoal(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            marginTop: '5px'
                        }}
                    >
                        <option value="">Select fitness goal</option>
                        <option value="Muscle Building">Muscle Building</option>
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="Weight Maintenance">Weight Maintenance</option>
                        <option value="Endurance Building">Endurance Building</option>
                    </select>
                </label>

                {recommendations.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {recommendations.map((food) => (
                            <div
                                key={food.food_code}
                                style={{
                                    width: 'calc(25% - 20px)', // 4 cards per row with spacing
                                    border: '1px solid #ddd',
                                    padding: '15px',
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <h4 style={{ color: '#2980b9', fontSize: '1rem' }}>{food.food_name}</h4>
                                <div style={{ fontSize: '0.9rem', color: '#34495e' }}>
                                    <p><strong>Protein:</strong> {food.protein_category}</p>
                                    <p><strong>Carbs:</strong> {food.carb_category}</p>
                                    <p><strong>Fat:</strong> {food.fat_category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#e74c3c' }}>No recommendations available. Please select activity level and fitness goal.</p>
                )}
            </div>
        </div>
    );
}

export default DietPlan;
