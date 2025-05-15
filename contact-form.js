// Enhanced Contact Form with Validation and Animations
class ContactForm {
    constructor() {
        this.form = null;
        this.formElements = {
            name: null,
            email: null,
            subject: null,
            message: null,
            submitButton: null
        };
        this.formState = {
            isSubmitting: false,
            isValid: false,
            errors: {}
        };
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        // Find contact form
        this.form = document.querySelector('.contact-form');
        if (!this.form) {
            console.warn('Contact form not found');
            return;
        }
        
        // Get form elements
        this.formElements = {
            name: this.form.querySelector('input[name="name"]'),
            email: this.form.querySelector('input[name="email"]'),
            subject: this.form.querySelector('input[name="subject"]'),
            message: this.form.querySelector('textarea[name="message"]'),
            submitButton: this.form.querySelector('button[type="submit"]')
        };
        
        // Add floating labels
        this.enhanceFormInputs();
        
        // Add validation
        this.setupValidation();
        
        // Add submission handling
        this.setupSubmission();
    }
    
    enhanceFormInputs() {
        // Create floating label effect for inputs
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Skip if already enhanced
            if (input.parentElement.classList.contains('form-field')) return;
            
            // Create field wrapper
            const fieldWrapper = document.createElement('div');
            fieldWrapper.className = 'form-field';
            
            // Create label element if needed
            let label;
            const existingLabel = input.previousElementSibling;
            if (existingLabel && existingLabel.tagName === 'LABEL') {
                label = existingLabel;
                existingLabel.remove();
            } else {
                label = document.createElement('label');
                label.setAttribute('for', input.id || input.name);
                label.textContent = input.placeholder || input.name;
            }
            
            // Create error message element
            const errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            
            // Rearrange elements
            input.parentNode.insertBefore(fieldWrapper, input);
            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(input);
            fieldWrapper.appendChild(errorElement);
            
            // Add focus and blur events for animation
            input.addEventListener('focus', () => {
                fieldWrapper.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                fieldWrapper.classList.remove('focused');
                if (input.value.trim()) {
                    fieldWrapper.classList.add('has-value');
                } else {
                    fieldWrapper.classList.remove('has-value');
                }
            });
            
            // Check if input already has a value
            if (input.value.trim()) {
                fieldWrapper.classList.add('has-value');
            }
        });
    }
    
    setupValidation() {
        // Add validation for each field
        const { name, email, message } = this.formElements;
        
        if (name) {
            name.addEventListener('input', () => {
                this.validateField(name, value => {
                    if (!value.trim()) return 'Please enter your name';
                    if (value.trim().length < 2) return 'Name must be at least 2 characters';
                    return null;
                });
            });
        }
        
        if (email) {
            email.addEventListener('input', () => {
                this.validateField(email, value => {
                    if (!value.trim()) return 'Please enter your email';
                    
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) return 'Please enter a valid email address';
                    
                    return null;
                });
            });
        }
        
        if (message) {
            message.addEventListener('input', () => {
                this.validateField(message, value => {
                    if (!value.trim()) return 'Please enter your message';
                    if (value.trim().length < 10) return 'Message must be at least 10 characters';
                    return null;
                });
            });
        }
        
        // Validate all fields on form submission
        this.form.addEventListener('submit', e => {
            const isValid = this.validateAllFields();
            if (!isValid) {
                e.preventDefault();
            }
        });
    }
    
    validateField(field, validationFn) {
        // Skip validation if field doesn't exist
        if (!field) return true;
        
        const value = field.value;
        const fieldWrapper = field.closest('.form-field');
        const errorElement = fieldWrapper.querySelector('.form-error');
        
        // Run validation function
        const errorMessage = validationFn(value);
        
        // Update field state
        if (errorMessage) {
            fieldWrapper.classList.add('error');
            if (errorElement) errorElement.textContent = errorMessage;
            this.formState.errors[field.name] = errorMessage;
            return false;
        } else {
            fieldWrapper.classList.remove('error');
            if (errorElement) errorElement.textContent = '';
            delete this.formState.errors[field.name];
            return true;
        }
    }
    
    validateAllFields() {
        const { name, email, message } = this.formElements;
        
        // Validate required fields
        const nameValid = this.validateField(name, value => {
            if (!value.trim()) return 'Please enter your name';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            return null;
        });
        
        const emailValid = this.validateField(email, value => {
            if (!value.trim()) return 'Please enter your email';
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            
            return null;
        });
        
        const messageValid = this.validateField(message, value => {
            if (!value.trim()) return 'Please enter your message';
            if (value.trim().length < 10) return 'Message must be at least 10 characters';
            return null;
        });
        
        // Update form state
        this.formState.isValid = nameValid && emailValid && messageValid;
        
        return this.formState.isValid;
    }
    
    setupSubmission() {
        // Add form submission handler
        this.form.addEventListener('submit', async e => {
            e.preventDefault();
            
            if (this.formState.isSubmitting) return;
            
            // Validate all fields first
            const isValid = this.validateAllFields();
            if (!isValid) return;
            
            // Update UI state
            this.formState.isSubmitting = true;
            this.updateSubmitButtonState();
            
            try {
                // Simulate form submission
                await this.simulateFormSubmission();
                
                // Show success message
                this.showSuccessMessage();
                
                // Reset form
                this.form.reset();
                document.querySelectorAll('.form-field').forEach(field => {
                    field.classList.remove('has-value', 'focused');
                });
                
            } catch (error) {
                // Show error message
                this.showErrorMessage(error.message);
            } finally {
                // Reset submission state
                this.formState.isSubmitting = false;
                this.updateSubmitButtonState();
            }
        });
    }
    
    updateSubmitButtonState() {
        const { submitButton } = this.formElements;
        if (!submitButton) return;
        
        if (this.formState.isSubmitting) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner"></span> Sending...';
        } else {
            submitButton.disabled = false;
            submitButton.textContent = 'SEND MESSAGE';
        }
    }
    
    async simulateFormSubmission() {
        // Simulate form submission with a delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 90% chance of success (for demonstration)
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error. Please try again.'));
                }
            }, 1500);
        });
    }
    
    showSuccessMessage() {
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-message success';
        successMessage.innerHTML = `
            <div class="message-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="message-content">
                <h4>Message Sent!</h4>
                <p>Thank you for reaching out. I'll get back to you soon.</p>
            </div>
        `;
        
        // Show message
        this.form.style.opacity = '0';
        setTimeout(() => {
            this.form.parentNode.insertBefore(successMessage, this.form.nextSibling);
            this.form.style.display = 'none';
            
            // Add close button
            const closeButton = document.createElement('button');
            closeButton.className = 'message-close';
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            closeButton.addEventListener('click', () => {
                successMessage.remove();
                this.form.style.display = '';
                setTimeout(() => {
                    this.form.style.opacity = '1';
                }, 10);
            });
            
            successMessage.appendChild(closeButton);
        }, 300);
    }
    
    showErrorMessage(message) {
        // Create error toast
        const errorToast = document.createElement('div');
        errorToast.className = 'form-toast error';
        errorToast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="toast-content">
                <p>${message}</p>
            </div>
        `;
        
        // Show toast
        document.body.appendChild(errorToast);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            errorToast.classList.add('toast-exit');
            setTimeout(() => {
                errorToast.remove();
            }, 300);
        }, 4000);
    }
}

// Initialize contact form
const contactForm = new ContactForm();
