/* ========================================
   Trident Pool Service - Interactive Features
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const nav = document.getElementById('nav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const contactForm = document.getElementById('contactForm');
    
    // ========================================
    // Navigation Scroll Effect
    // ========================================
    let lastScroll = 0;
    
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class when past hero
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    // ========================================
    // Mobile Menu
    // ========================================
    const toggleMobileMenu = () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    };
    
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ========================================
    // Intersection Observer for Animations
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                // Optional: unobserve after animation
                // animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        animateOnScroll.observe(el);
    });
    
    // ========================================
    // Contact Form Handling
    // ========================================
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate
            if (!data.name || !data.phone || !data.service) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual endpoint)
            try {
                // In a real implementation, you'd send to a server
                // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
                
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Success!
                showNotification('Thank you! We\'ll call you back within 24 hours.', 'success');
                contactForm.reset();
                
            } catch (error) {
                showNotification('Something went wrong. Please call us directly at (864) 940-2250.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // ========================================
    // Notification System
    // ========================================
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            maxWidth: '400px',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            background: type === 'success' ? '#0a2540' : '#dc2626',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            zIndex: '9999',
            animation: 'slideIn 0.3s ease-out',
            fontFamily: 'Outfit, sans-serif'
        });
        
        // Add animation keyframes if not exists
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                    line-height: 1;
                }
                .notification-close:hover {
                    opacity: 1;
                }
                .loading-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // ========================================
    // Phone Number Formatting
    // ========================================
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 10) {
                value = value.substring(0, 10);
                e.target.value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
            } else if (value.length >= 6) {
                e.target.value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
            } else if (value.length >= 3) {
                e.target.value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
            } else {
                e.target.value = value;
            }
        });
    }
    
    // ========================================
    // Ripple Effect on Cards (Optional Enhancement)
    // ========================================
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.setProperty('--mouse-x', e.offsetX + 'px');
            this.style.setProperty('--mouse-y', e.offsetY + 'px');
        });
    });
    
    // ========================================
    // Lazy load animations for performance
    // ========================================
    if ('IntersectionObserver' in window) {
        const lazyElements = document.querySelectorAll('.service-card, .value-item, .contact-method');
        
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    entry.target.style.animationDelay = `${Array.from(lazyElements).indexOf(entry.target) * 0.1}s`;
                    lazyObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });
        
        lazyElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            lazyObserver.observe(el);
        });
    }
    
    console.log('🔱 Trident Pool Service - Site Ready');
});
