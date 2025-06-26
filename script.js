document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            // Check if answer exists and if it's currently open
            const isOpen = answer && answer.classList.contains('open');

            // Close all other open FAQ items for a single-open accordion effect
            faqQuestions.forEach(otherQuestion => {
                const otherAnswer = otherQuestion.nextElementSibling;
                // Ensure it's a different question and its answer is currently open
                if (otherQuestion !== question && otherAnswer && otherAnswer.classList.contains('open')) {
                    otherAnswer.classList.remove('open');
                    otherAnswer.style.maxHeight = null; // Dynamically reset max-height to close
                    otherQuestion.classList.remove('active');
                    // Reset ARIA attributes for closed items
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.setAttribute('aria-hidden', 'true');
                }
            });

            // Toggle the clicked FAQ item
            if (isOpen) {
                // If it's open, close it
                answer.classList.remove('open');
                answer.style.maxHeight = null; // Dynamically reset max-height to close
                question.classList.remove('active');
                // Set ARIA attributes for closed state
                question.setAttribute('aria-expanded', 'false');
                answer.setAttribute('aria-hidden', 'true');
            } else {
                // If it's closed, open it
                answer.classList.add('open');
                // *** IMPORTANT CHANGE HERE ***
                // Setting a large fixed max-height instead of using scrollHeight,
                // as scrollHeight was returning an incorrect value.
                // CSS transition will handle the smooth animation up to the content's actual height.
                answer.style.maxHeight = '2000px'; // You can increase this if you have extremely long answers (e.g., '9999px')
                // **************************
                question.classList.add('active');
                // Set ARIA attributes for open state
                question.setAttribute('aria-expanded', 'true');
                answer.setAttribute('aria-hidden', 'false');
            }
        });
    });

    // Mobile Navigation Toggle & Dropdown Handling
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    const servicesDropdownLi = document.querySelector('.nav-links .has-dropdown');

    if (mobileMenuButton && navLinks) {
        // Toggle the mobile menu itself (hamburger icon click)
        mobileMenuButton.addEventListener('click', () => {
            const isMenuOpen = navLinks.classList.toggle('active'); // Toggles active class
            mobileMenuButton.classList.toggle('active'); // Animates the hamburger icon

            // Update aria-expanded attribute based on menu state
            mobileMenuButton.setAttribute('aria-expanded', isMenuOpen);

            // If the main mobile menu is being closed, ensure any open dropdown within it is also closed
            if (!isMenuOpen && servicesDropdownLi && servicesDropdownLi.classList.contains('active')) {
                servicesDropdownLi.classList.remove('active');
                // Also update ARIA for the dropdown link if it's serving as a toggle
                const servicesLink = servicesDropdownLi.querySelector('a[href="#services"]');
                if (servicesLink) {
                    servicesLink.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Handle dropdown toggle specifically for the 'Services' link when on mobile
        if (servicesDropdownLi) { // Ensure the dropdown LI exists
            const servicesLink = servicesDropdownLi.querySelector('a[href="#services"]');
            if (servicesLink) { // Ensure the services link within the dropdown exists
                servicesLink.addEventListener('click', function(e) {
                    // This logic only applies when in a mobile view (e.g., <= 768px based on typical breakpoints)
                    // and when the mobile navigation menu is currently open/active.
                    // We assume 'active' class on navLinks means it's in mobile view.
                    if (navLinks.classList.contains('active')) {
                        e.preventDefault(); // Prevent the default scroll behavior for #services
                        const isDropdownOpen = servicesDropdownLi.classList.toggle('active'); // Toggle the dropdown submenu's visibility
                        servicesLink.setAttribute('aria-expanded', isDropdownOpen); // Update ARIA for the dropdown link
                    }
                    // On desktop, the CSS `:hover` and `:focus-within` should handle the dropdown.
                });
            }
        }
    }

    // Define a constant for consistent scroll padding if needed
    // This value should ideally match the height of your fixed header plus any extra desired padding
    const SCROLL_OFFSET_PADDING = 20; // Extra padding in pixels below the fixed header

    // Smooth scrolling for all internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const headerElement = document.querySelector('.header');
            const headerOffset = headerElement ? headerElement.offsetHeight : 0; // Get header height, default to 0 if not found

            // Handle links that are purely '#' (e.g., logo to top of page)
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                // Close mobile menu if open when such a link is clicked
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuButton.classList.remove('active');
                    mobileMenuButton.setAttribute('aria-expanded', 'false'); // Update ARIA
                    if (servicesDropdownLi && servicesDropdownLi.classList.contains('active')) {
                        servicesDropdownLi.classList.remove('active');
                        // Reset ARIA for services link if it was expanded
                        const servicesLink = servicesDropdownLi.querySelector('a[href="#services"]');
                        if (servicesLink) {
                            servicesLink.setAttribute('aria-expanded', 'false');
                        }
                    }
                }
                return; // Stop further processing for this anchor
            }

            const targetElement = document.querySelector(href);

            // If the target element doesn't exist, let the browser handle the link naturally
            if (!targetElement) {
                return;
            }

            // Check if this is the special '#services' link acting as a mobile dropdown toggle.
            // This logic relies on `navLinks` being active for mobile state.
            const isServicesDropdownToggle = (
                href === '#services' &&
                navLinks && navLinks.classList.contains('active')
            );

            // Proceed with smooth scrolling only if it's NOT the mobile dropdown toggle for 'Services'.
            if (!isServicesDropdownToggle) {
                e.preventDefault(); // Stop the browser's default jump behavior

                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - SCROLL_OFFSET_PADDING;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // After scrolling to a section, close the mobile menu if it's open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuButton.classList.remove('active');
                    mobileMenuButton.setAttribute('aria-expanded', 'false'); // Update ARIA
                    if (servicesDropdownLi && servicesDropdownLi.classList.contains('active')) {
                        servicesDropdownLi.classList.remove('active');
                        // Reset ARIA for services link if it was expanded
                        const servicesLink = servicesDropdownLi.querySelector('a[href="#services"]');
                        if (servicesLink) {
                            servicesLink.setAttribute('aria-expanded', 'false');
                        }
                    }
                }
            }
            // If `isServicesDropdownToggle` was true, the `e.preventDefault()` was already handled
            // by the `servicesLink` listener, and no scrolling is needed here.
        });
    });
});

// Gemini AI Assistant Simulation for FAQ Page
document.addEventListener('DOMContentLoaded', () => {
    const geminiQuestionButtons = document.querySelectorAll('.gemini-question-button');
    const geminiResponseArea = document.getElementById('gemini-response');

    // Define the static responses for each question
    const responses = {
        "cost-2bhk": "For a 2BHK apartment in Bangalore, the cost of a Matterport scan typically starts from around INR 7,000 to INR 15,000, depending on the exact area, any specific features you want highlighted, and additional deliverables like floor plans. Please contact us for a precise quote tailored to your property.",
        "large-factory-chennai": "Yes, we absolutely can! Scanning a large factory in Chennai is well within our capabilities. The duration depends on the total square footage, complexity (e.g., machinery, multi-levels), and required detail. Such projects usually take 1-3 days for scanning, with digital twin delivery within a week. We'd conduct a detailed site assessment to give you an accurate timeline.",
        "services-mumbai": "Adostrophe provides Matterport and 3D immersive services across all major Indian cities, including Mumbai, Delhi, Bangalore, Chennai, Kolkata, Pune, Hyderabad, and Ahmedabad. Our teams are equipped to travel nationwide to bring our cutting-edge solutions to your doorstep.",
        "real-estate-benefits": "For real estate in Delhi, Matterport virtual tours offer immense benefits: 1. **24/7 Open Houses:** Buyers can tour properties anytime, anywhere, increasing reach. 2. **Reduced Physical Viewings:** Qualify leads more effectively, saving time. 3. **Enhanced Marketing:** Stand out with immersive listings. 3. **Transparency & Trust:** Build buyer confidence by offering a complete view. 4. **Faster Sales Cycles:** Engaged buyers make decisions quicker.",
        "2d-floor-plans": "Yes, you can! From your Matterport scan, we can generate highly accurate 2D floor plans of your property in Pune. These are perfect for marketing materials, space planning, or providing a clear layout to potential buyers. We offer various export formats to suit your needs.",
        "lighting-retail": "For scanning your retail store in Kolkata, optimal lighting is crucial. We recommend: 1. **Bright, Even Lighting:** Turn on all lights, including accent lighting. 2. **Minimize Harsh Shadows:** Avoid direct, strong spotlights that create deep shadows. 3. **Natural Light:** Open blinds or curtains, but be mindful of direct sunlight causing overexposure. 4. **Clean Windows/Mirrors:** These can cause reflections if not clean. Good lighting ensures the best visual quality and accurate data capture for your digital twin."
    };

    // Add click event listeners to each question button
    geminiQuestionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const questionKey = button.dataset.question; // Get the key from data-question attribute
            // Update the response area with the corresponding answer
            geminiResponseArea.innerHTML = `<p>${responses[questionKey]}</p>`;
            // Optionally, scroll the response into view for better UX on smaller screens
            geminiResponseArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });
});