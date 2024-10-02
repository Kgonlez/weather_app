# weather_app
This Weather App, prerequisute for advanced pre work assignment, allows users to search for any city and retrieve its current weather conditions along with a 7-day forecast.The app displays essential weather details such as temperature, wind speedm weather conditions, and images representing the current and forecasted weather. The user can toggle between Celsius and Fehrenheit for temperature units. 

Features
Search by City: Enter the name of a city to view its current weather and 7-day forecast.
Toggle Temperature Units: Switch between Celsius and Fehrenheit.
Responsive Design: Workds on desktop and mobile devices.
Localized Time: Displays the current local time of the searched city.
Weather Conditions & Images: Displays weather condition texts and corresponding images.

Technologies Used
HTML, CSS, JavaScript, Open Mateo API for weather data, OpenCageData API for geocoding, Vite for bundling

Prerequisites
Before running the app locally, ensure that you have following installed:
Node.js (v14+)
NPM or Yarn

How to Download and Run Locally
1. Clone the repository: git clone https://github.com/Kgonlez/weather_app.git
2. Navigate to the project directory: cd weather-app
3. Install dependencies: npm install or yarn install 
4. Create an account for open cage data at https://opencagedata.com/api#quickstart for geocoding API key
5. Set up your environment variables: Create a new .env file in the root of your project and add your API keys 
    VITE_GEOCODE_API_KEY= your_opencagedata_api_key
6. Run Development Server: npm run dev or yarn dev
7. Open the app in your browser in local host 

API Usage
OpenCageData API: Used to convert city names to geographic coordinates(latitude and longitude)
Open Meteo API: Fetches current weather and 7-day forecast data using the coordinates from OpenCageData

Known Issues 
If the entered city name does not exist, an error message will appear.
