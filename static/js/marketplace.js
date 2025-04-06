document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
          } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }
      });
    }
  
    // Product Favorite Toggle
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const icon = this.querySelector('i');
        if (icon.classList.contains('far')) {
          icon.classList.remove('far');
          icon.classList.add('fas');
          showToast('Product added to favorites');
        } else {
          icon.classList.remove('fas');
          icon.classList.add('far');
          showToast('Product removed from favorites');
        }
      });
    });
  
    // Add to Cart functionality
    const cartButtons = document.querySelectorAll('.btn-primary .fa-shopping-cart');
    cartButtons.forEach(button => {
      button.parentElement.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-title').textContent;
        showToast(`${productName} added to cart`);
      });
    });
  
    // Weather Widget Refresh
    const refreshWeatherButton = document.getElementById('refresh-weather');
    if (refreshWeatherButton) {
      refreshWeatherButton.addEventListener('click', function() {
        this.classList.add('rotating');
        fetchWeatherData();
        setTimeout(() => {
          this.classList.remove('rotating');
        }, 1000);
      });
    }
  
    // Product filtering functionality (for marketplace page)
    const filterButtons = document.querySelectorAll('.filter-option');
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.dataset.filter;
        const productCards = document.querySelectorAll('.product-card');
        
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        if (filter === 'all') {
          productCards.forEach(card => card.style.display = 'flex');
        } else {
          productCards.forEach(card => {
            if (card.classList.contains(filter)) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        }
      });
    });
  
    // Search functionality
    const searchForms = document.querySelectorAll('form:has(input[type="text"][placeholder="Search products..."])');
    searchForms.forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchInput = this.querySelector('input[type="text"]');
        if (searchInput && searchInput.value.trim()) {
          // Redirect to marketplace with search query
          window.location.href = `marketplace.html?search=${encodeURIComponent(searchInput.value.trim())}`;
        }
      });
    });
  
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput && emailInput.value.trim()) {
          showToast('Thank you for subscribing to our newsletter!');
          emailInput.value = '';
        }
      });
    }
  
    // Initialize weather data on page load
    fetchWeatherData();
  
    // Product detail page quantity input (if on product detail page)
    const quantityInput = document.getElementById('quantity-input');
    const totalPrice = document.getElementById('total-price');
    const unitPrice = document.getElementById('unit-price');
    
    if (quantityInput && totalPrice && unitPrice) {
      quantityInput.addEventListener('change', function() {
        const price = parseFloat(unitPrice.dataset.price);
        const quantity = parseInt(this.value) || 1;
        const total = price * quantity;
        totalPrice.textContent = `₹${total.toLocaleString()}`;
      });
    }
  
    // Helper function to fetch weather data
    function fetchWeatherData() {
      const weatherWidget = document.getElementById('weather-widget');
      if (!weatherWidget) return;
  
      // Simulate API call with mock data
      setTimeout(() => {
        const weatherData = {
          temperature: Math.floor(Math.random() * 15) + 20, // Random temp between 20-35
          humidity: Math.floor(Math.random() * 30) + 50, // Random humidity between 50-80
          rainfall: Math.random() < 0.7 ? 0 : Math.floor(Math.random() * 10), // 70% chance of 0mm
          tips: [
            "Good day for harvesting wheat crops.",
            "Consider irrigation for vegetable fields.",
            "Ideal conditions for applying organic fertilizers."
          ]
        };
  
        // Update weather UI
        const temperatureEl = weatherWidget.querySelector('.temperature');
        const humidityEl = weatherWidget.querySelector('.humidity');
        const rainfallEl = weatherWidget.querySelector('.rainfall');
        
        if (temperatureEl) temperatureEl.textContent = `${weatherData.temperature}°C`;
        if (humidityEl) humidityEl.innerHTML = `<i class="fas fa-tint"></i> Humidity: ${weatherData.humidity}%`;
        if (rainfallEl) rainfallEl.innerHTML = `<i class="fas fa-cloud-rain"></i> Rainfall: ${weatherData.rainfall} mm`;
      }, 500);
    }
  
    // Toast notification system
    function showToast(message) {
      // Check if a toast container already exists
      let toastContainer = document.querySelector('.toast-container');
      
      // If not, create one
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
        
        // Add styles if not already in the CSS
        const style = document.createElement('style');
        style.textContent = `
          .toast-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
          }
          .toast {
            background-color: var(--bg-tertiary);
            color: var(--text-white);
            padding: 12px 20px;
            border-radius: 4px;
            margin-top: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
            max-width: 300px;
          }
          .toast::before {
            content: '';
            width: 4px;
            height: 100%;
            background-color: var(--accent-green);
            position: absolute;
            left: 0;
            top: 0;
            border-radius: 4px 0 0 4px;
          }
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Create the toast
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      
      // Add to container
      toastContainer.appendChild(toast);
      
      // Remove after animation
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  
    // Parse URL parameters (for marketplace search)
    function getUrlParams() {
      const params = {};
      const queryString = window.location.search.substring(1);
      const pairs = queryString.split('&');
      
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        if (pair[0]) {
          params[pair[0]] = decodeURIComponent(pair[1] || '');
        }
      }
      
      return params;
    }
  
    // Initialize search from URL (for marketplace page)
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    if (searchInput) {
      const params = getUrlParams();
      if (params.search) {
        searchInput.value = params.search;
        // Trigger search functionality if on marketplace page
        const marketplaceGrid = document.getElementById('marketplace-grid');
        if (marketplaceGrid) {
          // Filter products by search term
          filterProductsBySearch(params.search);
        }
      }
    }
  
    // Filter products by search term
    function filterProductsBySearch(term) {
      const productCards = document.querySelectorAll('.product-card');
      const searchTerm = term.toLowerCase();
      
      productCards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        const description = card.querySelector('.product-description').textContent.toLowerCase();
        const location = card.querySelector('.location').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm) || location.includes(searchTerm)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }
});