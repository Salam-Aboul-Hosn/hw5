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
