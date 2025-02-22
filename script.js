// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once animation is triggered
        }
    });
};

const observer = new IntersectionObserver(handleIntersect, observerOptions);

// Start observing elements with animation classes
const animateElements = () => {
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
        observer.observe(el);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    animateElements();
    
    // Dark mode toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = savedTheme;
    updateThemeIcons(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.dataset.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
    });
    
    function updateThemeIcons(theme) {
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // Form Handling
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('.submit-button');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        const errors = validateForm(data);
        
        if (Object.keys(errors).length > 0) {
            showFormErrors(errors);
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span>Verzenden...</span>
            <svg class="loading-spinner" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
            </svg>
        `;

        // Simulate form submission (replace with actual API call)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showFormSuccess();
            contactForm.reset();
        } catch (error) {
            // Show error message
            showFormError();
        } finally {
            // Reset button
            submitButton.disabled = false;
            submitButton.innerHTML = `
                <span>Verstuur Bericht</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            `;
        }
    });

    function validateForm(data) {
        const errors = {};
        
        if (!data.name?.trim()) {
            errors.name = 'Naam is verplicht';
        }
        
        if (!data.email?.trim()) {
            errors.email = 'Email is verplicht';
        } else if (!isValidEmail(data.email)) {
            errors.email = 'Ongeldig email adres';
        }
        
        if (!data.subject) {
            errors.subject = 'Onderwerp is verplicht';
        }
        
        if (!data.message?.trim()) {
            errors.message = 'Bericht is verplicht';
        }
        
        return errors;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFormErrors(errors) {
        // Remove existing error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        // Show new error messages
        Object.entries(errors).forEach(([field, message]) => {
            const input = document.getElementById(field);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            input.classList.add('error');
            input.parentNode.appendChild(errorDiv);
        });
    }

    function showFormSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Bedankt voor uw bericht! We nemen zo spoedig mogelijk contact met u op.';
        contactForm.insertAdjacentElement('beforebegin', successMessage);
        
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    function showFormError() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message form-error';
        errorMessage.textContent = 'Er is iets misgegaan. Probeer het later opnieuw.';
        contactForm.insertAdjacentElement('beforebegin', errorMessage);
        
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }

    // Mobile Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('#main-menu');
    
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mainMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'visible' : 'hidden';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !mainMenu.contains(e.target)) {
            menuToggle.setAttribute('aria-expanded', 'false');
            mainMenu.classList.remove('active');
            document.body.style.overflow = 'visible';
        }
    });

    // Close menu when clicking on a link
    mainMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            mainMenu.classList.remove('active');
            document.body.style.overflow = 'visible';
        });
    });

    // Escape key closes menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainMenu.classList.contains('active')) {
            menuToggle.setAttribute('aria-expanded', 'false');
            mainMenu.classList.remove('active');
            document.body.style.overflow = 'visible';
        }
    });

    // Carousel
    const isMobile = () => window.innerWidth <= 768;
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsContainer = document.querySelector('.carousel-dots');

    // Clone first and last slides for infinite loop effect
    const firstSlideClone = slides[0].cloneNode(true);
    const lastSlideClone = slides[slides.length - 1].cloneNode(true);
    track.appendChild(firstSlideClone);
    track.insertBefore(lastSlideClone, slides[0]);

    // Calculate initial index to center the carousel
    const initialIndex = Math.ceil(slides.length / 2);
    let currentIndex = initialIndex;
    
    // Create dot indicators (excluding cloned slides)
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Ga naar slide ${index + 1}`);
        if (index === initialIndex - 1) {
            dot.classList.add('active');
            dot.setAttribute('aria-current', 'true');
        }
        dot.addEventListener('click', () => goToSlide(index + 1));
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(document.querySelectorAll('.dot'));

    function updateSlides() {
        const allSlides = Array.from(track.children);
        allSlides.forEach((slide, index) => {
            slide.classList.remove('active');
            // Add active class to current slide and its neighbors
            if (index === currentIndex) {
                slide.classList.add('active');
            }
        });
    }

    function updateDots() {
        // Adjust for cloned slides in dot display
        const actualIndex = currentIndex - 1;
        const normalizedIndex = (actualIndex + slides.length) % slides.length;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === normalizedIndex);
            dot.setAttribute('aria-current', index === normalizedIndex);
        });
    }

    function goToSlide(index) {
        // Calculate the transform considering the slide width and centering
        const slideWidth = window.innerWidth <= 768 ? 100 : 33.333;
        const offset = slideWidth * (index - 1);
        track.style.transform = `translateX(-${offset}%)`;
        currentIndex = index;
        
        // Update active state for all slides
        const allSlides = Array.from(track.children);
        allSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
        
        updateDots();
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            goToSlide(currentIndex);
        }, 100);
    });

    function nextSlide() {
        if (currentIndex >= slides.length + 1) {
            currentIndex = 1;
            track.style.transition = 'none';
            goToSlide(currentIndex);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    track.style.transition = 'transform 0.5s ease-in-out';
                    currentIndex++;
                    goToSlide(currentIndex);
                });
            });
        } else {
            currentIndex++;
            goToSlide(currentIndex);
        }
    }

    function prevSlide() {
        if (currentIndex <= 0) {
            currentIndex = slides.length;
            track.style.transition = 'none';
            goToSlide(currentIndex);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    track.style.transition = 'transform 0.5s ease-in-out';
                    currentIndex--;
                    goToSlide(currentIndex);
                });
            });
        } else {
            currentIndex--;
            goToSlide(currentIndex);
        }
    }

    // Initial setup
    goToSlide(currentIndex);

    // Event listeners
    nextButton.addEventListener('click', () => {
        if (!isDragging) nextSlide();
    });
    prevButton.addEventListener('click', () => {
        if (!isDragging) prevSlide();
    });

    // Prevent image dragging on mobile
    track.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // Enhanced mobile touch handling
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startTransform = 0;
    
    track.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            isDragging = true;
            startTransform = parseFloat(track.style.transform.replace('translateX(', '').replace('%)', '')) || 0;
            track.style.transition = 'none';
            // Prevent default only if we're on a slide
            if (e.target.closest('.carousel-slide')) {
                e.preventDefault();
            }
        }
    }, { passive: false });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        touchEndX = e.touches[0].clientX;
        const diff = touchEndX - touchStartX;
        const slideWidth = window.innerWidth <= 768 ? 100 : 33.333;
        const newTransform = startTransform + (diff / window.innerWidth * 100);
        
        // Limit dragging to one slide at a time
        if (Math.abs(diff) < window.innerWidth) {
            track.style.transform = `translateX(${newTransform}%)`;
        }
    }, { passive: true });
    
    track.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        isDragging = false;
        track.style.transition = 'transform 0.5s ease-in-out';
        
        const swipeDistance = touchEndX - touchStartX;
        const threshold = window.innerWidth * 0.2; // 20% of screen width
        
        if (Math.abs(swipeDistance) > threshold) {
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            // Snap back to current slide
            goToSlide(currentIndex);
        }
    });

    // Auto advance slides every 5 seconds if user hasn't disabled motion and isn't on mobile
    let autoAdvance;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !isMobile()) {
        const startAutoAdvance = () => {
            autoAdvance = setInterval(nextSlide, 5000);
        };

        const stopAutoAdvance = () => {
            clearInterval(autoAdvance);
        };

        startAutoAdvance();

        // Pause auto-advance when hovering over carousel
        const carousel = document.querySelector('.carousel-container');
        carousel.addEventListener('mouseenter', stopAutoAdvance);
        carousel.addEventListener('mouseleave', startAutoAdvance);

        // Pause auto-advance when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoAdvance();
            } else {
                startAutoAdvance();
            }
        });

        // Stop auto-advance if window is resized to mobile
        window.addEventListener('resize', () => {
            if (isMobile()) {
                stopAutoAdvance();
            } else {
                startAutoAdvance();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
});
