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
                answer.style.maxHeight = answer.scrollHeight + 'px'; // Dynamically set max-height to content height
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