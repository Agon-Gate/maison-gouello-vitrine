/**
 * Maison Gouëllo - Scripts & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });
    }

    // 2. Active Link on Scroll (ScrollSpy)
    const sections = document.querySelectorAll('section, header');
    
    function updateActiveLink() {
        let currentSectionId = 'hero';
        const scrollPosition = window.scrollY + 100; // Offset for sticky header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call

    // 3. Opening Hours Highlight Logic
    function highlightCurrentDayInTable() {
        const now = new Date();
        const day = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
        const rowId = `day-${day}`;
        const currentRow = document.getElementById(rowId);
        if (currentRow) {
            currentRow.classList.add('current-day');
        }
    }

    highlightCurrentDayInTable();

    // 4. Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form fields
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const messageInput = document.getElementById('contact-message');
            
            // Basic validation check
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                formFeedback.textContent = "Veuillez remplir tous les champs obligatoires.";
                formFeedback.className = "form-feedback error";
                return;
            }

            // Simulate form submission sending state
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Envoi en cours...";

            setTimeout(() => {
                // Success feedback
                formFeedback.textContent = "Merci pour votre message ! Nous vous recontacterons dans les plus brefs délais.";
                formFeedback.className = "form-feedback success";
                formFeedback.classList.remove('hidden');
                
                // Reset form fields
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;

                // Hide success message after 8 seconds
                setTimeout(() => {
                    formFeedback.classList.add('hidden');
                }, 8000);
            }, 1000);
        });
    }

    // 5. Simulate PDF Download for Catering Menu
    const downloadLink = document.getElementById('download-link');
    if (downloadLink) {
        downloadLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create a temporary notification element
            const notification = document.createElement('div');
            notification.textContent = "Téléchargement de la carte traiteur (simulé) lancé avec succès !";
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = 'var(--text-color)';
            notification.style.color = 'var(--bg-color)';
            notification.style.padding = '0.75rem 1.5rem';
            notification.style.borderRadius = '4px';
            notification.style.fontSize = '0.9rem';
            notification.style.fontWeight = '500';
            notification.style.zIndex = '2000';
            notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transition = 'opacity 0.5s ease';
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 3000);
        });
    }
});
