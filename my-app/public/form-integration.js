// Form Integration Script
// Add this script to your HTML page to integrate with the Next.js API

(function() {
    'use strict';
    
    // Success Modal Functions
    function showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'flex';
            // Trigger reflow to enable transition
            modal.offsetHeight;
            modal.classList.add('active');
            // Disable body scroll
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Form submission handler
    async function handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            whatsapp: formData.get('whatsapp'),
            email: formData.get('email'),
            city: formData.get('city')
        };
        
        // Validate
        if (!data.name || !data.whatsapp || !data.email || !data.city) {
            alert('Please fill in all fields');
            return;
        }
        
        // Update button state
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        submitButton.style.opacity = '0.7';
        
        try {
            // Send to API
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Success! Reset form and show success modal
                form.reset();
                showSuccessModal();
                
                // Optional: Send to Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'lead_capture', {
                        'device_type': result.data.device_type,
                        'city': data.city
                    });
                }
                
                // Optional: Facebook Pixel
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'Photography Class Registration'
                    });
                }
            } else {
                throw new Error(result.error || 'Failed to submit');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error submitting your registration. Please try again or contact us directly via WhatsApp.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.style.opacity = '1';
        }
    }
    
    // Scroll to form function
    function scrollToForm() {
        const form = document.querySelector('form');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Focus on first input after scroll
            setTimeout(() => {
                const firstInput = form.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 500);
        }
    }
    
    // Initialize when DOM is loaded
    function initialize() {
        // Attach form submission handler
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }
        
        // Attach scroll handlers to all CTA buttons
        const ctaButtons = document.querySelectorAll('button:not([type="submit"])');
        ctaButtons.forEach(button => {
            // Check if button text contains registration keywords
            const buttonText = button.textContent.toLowerCase();
            if (
                buttonText.includes('enskri') || 
                buttonText.includes('rezève') ||
                buttonText.includes('kòmanse')
            ) {
                button.addEventListener('click', scrollToForm);
            }
        });
        
        console.log('✅ Form integration initialized');
    }
    
    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();

