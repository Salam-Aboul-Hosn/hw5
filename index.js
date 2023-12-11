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

class WeatherWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <div style="display: flex;">
                  <p id="forecast" style="padding-right: 5px;"></p>
                  <p id="temp"></p>
                  </div>
                  <div class='column' id='iconic'></div>
      `;
  }

  connectedCallback() {
    this.fetchWeatherData();
  }

  fetchWeatherData() {
    fetch('https://api.weather.gov/gridpoints/SGX/54,20/forecast/hourly')
      .then((response) => response.json())
      .then((data) => {
        const weatherData = data.properties.periods[0];
        console.log(weatherData);
        this.shadowRoot.getElementById('forecast').innerHTML =
          weatherData.shortForecast;
        this.shadowRoot.getElementById(
          'temp'
        ).innerHTML = `${weatherData.temperature}°${weatherData.temperatureUnit}`;
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
customElements.define('weather-widget', WeatherWidget);
