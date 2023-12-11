class RatingWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.rating = 0;

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.classList.add('star');
      star.textContent = '★';
      star.addEventListener('mouseover', () => this.highlightStars(i));
      star.addEventListener('click', () => this.showThankYouMessage());
      this.shadowRoot.appendChild(star);
    }
    const style = document.createElement('style');

    style.innerHTML = `
                    .checked {  
                        color: yellow;
                    }
                `;

    this.shadowRoot.appendChild(style);
  }

  highlightStars(count) {
    const stars = this.shadowRoot.querySelectorAll('.star');
    stars.forEach((star, index) => {
      star.classList.toggle('checked', index < count);
    });
    this.rating = count;
  }

  async showThankYouMessage() {
    const message = document.createElement('div');
    if (this.rating <= 2) {
      message.textContent = `Thanks for the feedback of ${this.rating} stars. We'll try to do better.`;
    } else {
      message.textContent = `Thank you for rating: ${this.rating} stars!`;
    }
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(message);

    // Submit the star value to the endpoint
    await this.submitRatingToEndpoint();
  }

  async submitRatingToEndpoint() {
    const endpoint = 'https://httpbin.org/post';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Sent-By': 'JS',
        },
        body: JSON.stringify({ rating: this.rating, sentBy: 'js' }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Rating submitted successfully:', data);
      } else {
        console.error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error during rating submission:', error);
    }
  }
}

customElements.define('rating-widget', RatingWidget);

// Define a custom web component named WeatherWidget that extends the HTMLElement class.
class WeatherWidget extends HTMLElement {
  // Constructor for the WeatherWidget class.
  constructor() {
    // Call the constructor of the parent class (HTMLElement).
    super();

    // Create a shadow DOM for encapsulation.
    this.attachShadow({ mode: 'open' });

    // Set the inner HTML of the shadow DOM to include HTML elements for displaying weather information.
    this.shadowRoot.innerHTML = `
      <div style="display: flex;">
        <p id="forecast" style="padding-right: 5px;"></p>
        <p id="temp"></p>
      </div>
      <div class='column' id='iconic'></div>
    `;
  }

  // Lifecycle method called when the element is connected to the DOM.
  connectedCallback() {
    // Fetch weather data when the element is connected to the DOM.
    this.fetchWeatherData();
  }

  // Method to fetch weather data from the specified API endpoint.
  fetchWeatherData() {
    // Make a GET request to the National Weather Service API endpoint for hourly forecasts.
    fetch('https://api.weather.gov/gridpoints/SGX/54,20/forecast/hourly')
      .then((response) => response.json()) // Parse the JSON response.
      .then((data) => {
        // Extract the relevant weather data from the API response.
        const weatherData = data.properties.periods[0];

        // Log the retrieved weather data to the console for debugging purposes.
        console.log(weatherData);

        // Update the forecast and temperature elements in the shadow DOM with the retrieved data.
        this.shadowRoot.getElementById('forecast').innerHTML =
          weatherData.shortForecast;
        this.shadowRoot.getElementById(
          'temp'
        ).innerHTML = `${weatherData.temperature}°${weatherData.temperatureUnit}`;
      })
      .catch((error) => {
        // Log any errors that occur during the API request.
        console.error(error);
      });
  }
}

// Define the custom element 'weather-widget' using the WeatherWidget class.
customElements.define('weather-widget', WeatherWidget);
