// Run when page is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup navigation menu
    initMobileNavigation();
    
    // Setup FAQ dropdowns
    initFaqAccordion();
    
    // Setup resource filtering
    initFilterButtons();
    
    // Setup form validation
    initFormValidation();
    
    // Setup employee carousel
    initEmployeeCarousel();
    
    // Setup contact form
    initContactForm();
    
    // Setup home page carousel
    initHomeCarousel();

    // Setup theme toggle
    initThemeToggle();
});

// Handle theme toggle between light and dark mode
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply saved theme if exists, otherwise use system preference
    if (savedTheme === 'dark' || (savedTheme === null && prefersDarkScheme)) {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
    
    // Toggle theme when switch is clicked
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Handle mobile navigation menu
function initMobileNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!menuToggle) return;
    
    menuToggle.addEventListener('click', function() {
        document.body.classList.toggle('nav-active');
        
        // Update accessibility attributes
        const expanded = document.body.classList.contains('nav-active');
        menuToggle.setAttribute('aria-expanded', expanded);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#main-nav') && document.body.classList.contains('nav-active')) {
            document.body.classList.remove('nav-active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && document.body.classList.contains('nav-active')) {
            document.body.classList.remove('nav-active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Handle FAQ accordion dropdowns
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length === 0) return;
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle expanded state
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            
            // Close other questions
            if (!expanded) {
                faqQuestions.forEach(q => {
                    if (q !== question) {
                        q.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
    });
}

// Handle resource filtering by tags
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.resource-filters .filter-btn');
    const cards = document.querySelectorAll('.resource-card');
    
    if (filterButtons.length === 0 || cards.length === 0) return;
    
    const activeFilters = new Set(['all']);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Handle "all" filter
            if (filter === 'all') {
                activeFilters.clear();
                activeFilters.add('all');
                
                // Update button states
                filterButtons.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.filter === 'all');
                });
            } else {
                // Remove "all" filter when specific filter selected
                if (activeFilters.has('all')) {
                    activeFilters.delete('all');
                    filterButtons[0].classList.remove('active');
                }
                
                // Toggle this filter
                if (activeFilters.has(filter)) {
                    activeFilters.delete(filter);
                    this.classList.remove('active');
                    
                    // Reactivate "all" if no filters selected
                    if (activeFilters.size === 0) {
                        activeFilters.add('all');
                        filterButtons[0].classList.add('active');
                    }
                } else {
                    activeFilters.add(filter);
                    this.classList.add('active');
                }
            }
            
            // Apply filters to cards
            updateVisibleCards();
        });
    });
    
    function updateVisibleCards() {
        cards.forEach(card => {
            // Show all cards if "all" filter is active
            if (activeFilters.has('all')) {
                card.style.display = '';
                return;
            }
            
            // Check if card has any active tag
            const cardTags = card.dataset.tags ? card.dataset.tags.split(' ') : [];
            const hasActiveTag = cardTags.some(tag => activeFilters.has(tag));
            
            card.style.display = hasActiveTag ? '' : 'none';
        });
    }
}

// Handle form validation
function initFormValidation() {
    const form = document.getElementById('question-form');
    
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Check required fields
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'This field is required');
            } else if (field.type === 'email' && !isValidEmail(field.value.trim())) {
                isValid = false;
                showError(field, 'Please enter a valid email address');
            } else {
                removeError(field);
            }
        });
        
        if (isValid) {
            showFormResult(true);
            form.reset();
        } else {
            showFormResult(false);
        }
    });
    
    function showError(field, message) {
        field.classList.add('invalid');
        
        // Create or update error message
        let errorMsg = field.parentNode.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('p');
            errorMsg.className = 'error-message';
            field.parentNode.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }
    
    function removeError(field) {
        field.classList.remove('invalid');
        const errorMsg = field.parentNode.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showFormResult(success) {
        // Remove old messages
        const existingMsg = document.querySelector('.form-result-message');
        if (existingMsg) existingMsg.remove();
        
        // Create new message
        const msg = document.createElement('div');
        msg.className = 'form-result-message';
        
        if (success) {
            msg.textContent = 'Thank you! Your question has been submitted successfully.';
            msg.style.backgroundColor = '#d4edda';
            msg.style.color = '#155724';
            
            // Remove success message after 5 seconds
            setTimeout(() => msg.remove(), 5000);
        } else {
            msg.textContent = 'Please correct the errors in the form before submitting.';
            msg.style.backgroundColor = '#f8d7da';
            msg.style.color = '#721c24';
        }
        
        msg.style.padding = '1rem';
        msg.style.marginTop = '1rem';
        msg.style.borderRadius = '5px';
        
        form.parentNode.insertBefore(msg, form.nextSibling);
    }
}

// Handle employee carousel on About page
function initEmployeeCarousel() {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.employee-card');
    const prevButton = document.querySelector('.carousel-button-prev');
    const nextButton = document.querySelector('.carousel-button-next');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (!track || cards.length === 0) return;
    
    let currentIndex = 0;
    const cardCount = cards.length;
    
    // Set widths for responsive behavior
    function setCardWidth() {
        const width = track.clientWidth;
        cards.forEach(card => {
            card.style.minWidth = `${width}px`;
        });
    }
    
    // Update carousel display
    function updateDisplay() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            const isActive = index === currentIndex;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    }
    
    // Add navigation controls
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + cardCount) % cardCount;
            updateDisplay();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % cardCount;
            updateDisplay();
        });
    }
    
    // Add indicator controls
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentIndex = index;
            updateDisplay();
        });
    });
    
    // Add keyboard navigation
    track.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + cardCount) % cardCount;
            updateDisplay();
        } else if (event.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % cardCount;
            updateDisplay();
        }
    });
    
    // Initialize carousel
    setCardWidth();
    updateDisplay();
    
    // Update on window resize
    window.addEventListener('resize', setCardWidth);
}

// Handle contact form
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // Clear previous errors
        clearErrors();
        
        // Validate fields
        let isValid = true;
        
        // Check name (no numbers allowed)
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Please enter your name');
            isValid = false;
        } else if (/\d/.test(nameInput.value)) {
            showError(nameInput, 'Name should not contain numbers');
            isValid = false;
        }
        
        // Check email
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Please enter your email address');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Check message
        if (!messageInput.value.trim()) {
            showError(messageInput, 'Please enter your message');
            isValid = false;
        }
        
        // Submit form if valid
        if (isValid) {
            simulateSubmission(nameInput.value, emailInput.value);
            form.reset();
        }
    });
    
    function clearErrors() {
        const errorElements = form.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = '');
        
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => input.classList.remove('invalid'));
    }
    
    function showError(input, message) {
        input.classList.add('invalid');
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) errorElement.textContent = message;
    }
    
    function simulateSubmission(name, email) {
        const result = document.getElementById('form-result');
        
        // Show loading state
        result.textContent = 'Sending message...';
        result.style.backgroundColor = '#e2e3e5';
        result.style.color = '#383d41';
        result.style.padding = '1rem';
        result.style.marginTop = '1rem';
        result.style.borderRadius = '5px';
        
        // Show success after delay
        setTimeout(() => {
            result.textContent = `Thank you, ${name}! Your message has been sent successfully. We'll respond to ${email} as soon as possible.`;
            result.style.backgroundColor = '#d4edda';
            result.style.color = '#155724';
            
            // Clear message after 5 seconds
            setTimeout(() => {
                result.textContent = '';
                result.style.padding = '0';
                result.style.marginTop = '0';
                result.style.backgroundColor = 'transparent';
            }, 5000);
        }, 1500);
    }
}

// Handle home page carousel
function initHomeCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;
    
    // Start automatic slideshow
    startSlideshow();
    
    // Change to specific slide
    function goToSlide(index) {
        // Update slides
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        
        // Update indicators
        indicators.forEach((indicator, i) => {
            const isActive = i === index;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-pressed', isActive);
        });
        
        currentSlide = index;
    }
    
    // Navigation functions
    function nextSlide() {
        goToSlide((currentSlide + 1) % totalSlides);
    }
    
    function prevSlide() {
        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }
    
    // Control slideshow timing
    function startSlideshow() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function pauseSlideshow() {
        clearInterval(slideInterval);
    }
    
    // Add navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            pauseSlideshow();
            prevSlide();
            startSlideshow();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            pauseSlideshow();
            nextSlide();
            startSlideshow();
        });
    }
    
    // Add indicator buttons
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            pauseSlideshow();
            goToSlide(index);
            startSlideshow();
        });
    });
    
    // Add keyboard controls
    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            pauseSlideshow();
            prevSlide();
            startSlideshow();
        } else if (event.key === 'ArrowRight') {
            pauseSlideshow();
            nextSlide();
            startSlideshow();
        }
    });
    
    // Pause when hovering over carousel
    const container = document.querySelector('.carousel-container');
    if (container) {
        container.addEventListener('mouseenter', pauseSlideshow);
        container.addEventListener('mouseleave', startSlideshow);
    }
} 

// accordion (drop-down FAQs)

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click",
        function() {
            this.classList.toggle("accordion-active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";                
            } else {
                panel.style.display = "block";
            }
        });
}