import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import safe from './safe.json';
import warning from './warning.json';

function AirPollution() {
    const [location, setLocation] = useState('');
    const [pollutionData, setPollutionData] = useState(null);
    const [error, setError] = useState('');
    const [airQuality, setAirQuality] = useState('');
  
    const fetchCoordinates = async () => {
        try {
            const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
                params: {
                    q: location,
                    limit: 10,
                    appid: '035dec6574f4989a812a1ed508224acf'
                }
            });

            if (geoResponse.data.length === 0) {
                setError('Location not found. Please try another city or country.');
                return;
            }

            const { lat, lon } = geoResponse.data[0];
            fetchPollutionData(lat, lon);
        } catch (err) {
            setError('Error fetching location data.');
            console.error(err);
        }
    };

    const fetchPollutionData = async (latitude, longitude) => {
        try {
            const pollutionResponse = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution`, {
                params: {
                    lat: latitude,
                    lon: longitude,
                    appid: '035dec6574f4989a812a1ed508224acf'
                }
            });
            const data = pollutionResponse.data;
            setPollutionData(data);
            classifyAirQuality(data.list[0].main.aqi);
            setError('');
        } catch (err) {
            setError('Error fetching pollution data.');
            console.error(err);
        }
    };

    const classifyAirQuality = (aqi) => {
        if (aqi <= 50) setAirQuality("Good");
        else if (aqi <= 100) setAirQuality("Moderate");
        else setAirQuality("Bad");
    };

    // Define Lottie animation options based on air quality
    const lottieOptions = {
        loop: true,
        autoplay: true,
        animationData: airQuality === "Good" ? safe : warning,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div>
            <section id="hero">
                <div>
                    <span id="title">Airval</span>
                    <span id="name">by Sreenesh Reddy</span>
                </div>
                <input
                    id="input"
                    type="text"
                    placeholder="Enter city or country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <button onClick={fetchCoordinates}>Check Pollution Level</button>
            </section>
            {error ? (
                <p>{error}</p>
            ) : (
                pollutionData && (
                    <div className='total'>
                    <div className="outline">
                        <div className="dashboard-outline">
                            <div className='city'>
                                {location}
                                </div>
                            <div className="AQI">
                                <div className="card">
                                    <span> <span className='aqi'>Air Quality Index (AQI):</span> {pollutionData.list[0].main.aqi}</span>
                                </div>
                            </div>
                            <div className="ghg">
                                <div className="ghg">
                                <div className="green">
        <div className="card">
            <span className="pollutant-value">{pollutionData.list[0].components.no2} µg/m³</span>
            <span className="pollutant-name">Nitrogen Dioxide (NO₂)</span>
        </div>
        <div className="card">
            <span className="pollutant-value">{pollutionData.list[0].components.so2} µg/m³</span>
            <span className="pollutant-name">Sulfur Dioxide (SO₂)</span>
        </div>
        <div className="card">
            <span className="pollutant-value">{pollutionData.list[0].components.nh3} µg/m³</span>
            <span className="pollutant-name">Ammonia (NH₃)</span>
        </div>
        <div className="card">
            <span className="pollutant-value">{pollutionData.list[0].components.o3} µg/m³</span>
            <span className="pollutant-name">Ozone (O₃)</span>
        </div>
    </div>
</div>

                                <div className="climate">
                                    <div className="card">
                                        <span  className="pollutant-name">Carbon Monoxide (CO)</span>
                                        <span className="pollutant-value">{pollutionData.list[0].components.co} µg/m³</span>
                                    </div>
                                </div>
                            </div>
                            <div className="airpollutant">
                                <div className="card">
            <span className="pollutant-name">PM2.5:<span className="pollutant-value"> {pollutionData.list[0].components.pm2_5} µg/m³</span></span>
                                </div>
                                <div className="card">
                                    <span className="pollutant-name">PM10:<span className="pollutant-value"> {pollutionData.list[0].components.pm10} µg/m³</span></span>
                                </div>
                            </div>
                        </div>
                        <div className="lottiecontainer">
                            <Lottie options={lottieOptions} height={200} width={200} />
                            <span>
                                Air Quality is {airQuality}
                            </span>
                        </div>
                    </div>
                </div>
                )
            )}
        </div>
    );
}

export default AirPollution;
