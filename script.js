// Slideshow functionality
let slideIndex = 1;
let slideInterval;

// Initialize slideshow
document.addEventListener('DOMContentLoaded', function() {
    showSlide(slideIndex);
    startAutoSlide();
    initBackToTop();
    initContactForm();
    initVideoControls();
});

// Show specific slide
function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add('active');
    }
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add('active');
    }
}

// Next/Previous slide controls
function changeSlide(n) {
    stopAutoSlide();
    slideIndex += n;
    showSlide(slideIndex);
    startAutoSlide();
}

// Jump to specific slide
function currentSlide(n) {
    stopAutoSlide();
    slideIndex = n;
    showSlide(slideIndex);
    startAutoSlide();
}

// Auto-advance slides
function startAutoSlide() {
    slideInterval = setInterval(() => {
        slideIndex++;
        showSlide(slideIndex);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

// Pause auto-slide on hover
document.querySelector('.slideshow-container')?.addEventListener('mouseenter', stopAutoSlide);
document.querySelector('.slideshow-container')?.addEventListener('mouseleave', startAutoSlide);

// Smooth scroll to contact section
function scrollToContact() {
    document.getElementById('contact').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Back to top button functionality
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const service = formData.get('service');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !phone || !service) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Phone validation
        const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone)) {
            showNotification('Please enter a valid phone number.', 'error');
            return;
        }
        
        // Create WhatsApp message
        redirectToWhatsApp(name, phone, service, message);
        
        // Reset form after a short delay
        setTimeout(() => {
            contactForm.reset();
        }, 1000);
    });
}

// Function to redirect to WhatsApp with form details
function redirectToWhatsApp(name, phone, service, message) {
    // Speed Cool business WhatsApp number (replace with actual number)
    const businessWhatsAppNumber = '919876543210'; // Replace with actual business number
    
    // Get service name from the select option
    const serviceSelect = document.getElementById('service');
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    const serviceName = selectedOption.text;
    
    // Create formatted WhatsApp message
    let whatsappMessage = "Name: " + name + "\n";
    whatsappMessage += "Phone: " + phone + "\n";
    whatsappMessage += "Service: " + serviceName + "\n";
    whatsappMessage += "Details: " + (message || 'No additional details');
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${businessWhatsAppNumber}?text=${encodedMessage}`;
    
    // Show success notification
    showNotification('Redirecting to WhatsApp...', 'success');
    
    // Open WhatsApp in a new tab/window
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
    }, 1500);
    
    console.log('WhatsApp redirect:', whatsappURL);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        padding: 0;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        padding: 15px 20px;
        gap: 10px;
    `;
    
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close:hover {
        opacity: 1 !important;
    }
`;
document.head.appendChild(style);

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // If image is already loaded
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
});

// Service card animations
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.cta-button, .service-btn, .submit-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Keyboard navigation for slideshow
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// Touch/swipe support for slideshow
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.slideshow-container')?.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.querySelector('.slideshow-container')?.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            changeSlide(1); // Swipe left, go to next slide
        } else {
            changeSlide(-1); // Swipe right, go to previous slide
        }
    }
}

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedScrollHandler = debounce(() => {
    // Any scroll-heavy operations can go here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Video controls - ensure only one video plays at a time
function initVideoControls() {
    const videos = document.querySelectorAll('.video-container video');
    
    videos.forEach(video => {
        video.addEventListener('play', function() {
            // Pause all other videos when this one starts playing
            videos.forEach(otherVideo => {
                if (otherVideo !== video && !otherVideo.paused) {
                    otherVideo.pause();
                }
            });
        });
        
        // Optional: Add visual feedback when video is playing
        video.addEventListener('play', function() {
            this.closest('.video-card').classList.add('playing');
        });
        
        video.addEventListener('pause', function() {
            this.closest('.video-card').classList.remove('playing');
        });
        
        video.addEventListener('ended', function() {
            this.closest('.video-card').classList.remove('playing');
        });
    });
}

console.log('Speed Cool website loaded successfully! 🚀');
