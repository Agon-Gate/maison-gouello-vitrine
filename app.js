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

    // 3. Opening Hours & Current Status Logic
    const openingHours = {
        0: { name: 'Dimanche', slots: [{ start: '08:30', end: '12:30' }] }, // Sunday
        1: { name: 'Lundi', slots: [] }, // Monday (Closed)
        2: { name: 'Mardi', slots: [{ start: '08:00', end: '13:00' }, { start: '15:30', end: '19:00' }] },
        3: { name: 'Mercredi', slots: [{ start: '08:00', end: '13:00' }, { start: '15:30', end: '19:00' }] },
        4: { name: 'Jeudi', slots: [{ start: '08:00', end: '13:00' }, { start: '15:30', end: '19:00' }] },
        5: { name: 'Vendredi', slots: [{ start: '08:00', end: '13:00' }, { start: '15:30', end: '19:00' }] },
        6: { name: 'Samedi', slots: [{ start: '08:00', end: '13:00' }, { start: '15:30', end: '19:00' }] }
    };

    function highlightCurrentDayInTable(currentDayIndex) {
        const rowId = `day-${currentDayIndex}`;
        const currentRow = document.getElementById(rowId);
        if (currentRow) {
            currentRow.classList.add('current-day');
        }
    }

    function checkOpenStatus() {
        const now = new Date();
        const day = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTimeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        // Highlight current day in footer/main table
        highlightCurrentDayInTable(day);

        const statusDot = document.getElementById('status-dot');
        const statusText = document.getElementById('status-text');
        const hoursSummary = document.getElementById('hours-summary');

        if (!statusDot || !statusText || !hoursSummary) return;

        const todaySchedule = openingHours[day];
        
        // Format today's hours for display
        let hoursDisplayText = '';
        if (todaySchedule.slots.length === 0) {
            hoursDisplayText = "Aujourd'hui : Fermé";
        } else {
            hoursDisplayText = "Aujourd'hui : " + todaySchedule.slots.map(slot => `${slot.start} - ${slot.end}`).join(' et ');
        }
        hoursSummary.textContent = hoursDisplayText;

        // Check if currently open
        let isOpen = false;
        let nextStatusMsg = '';

        if (todaySchedule.slots.length > 0) {
            for (const slot of todaySchedule.slots) {
                if (currentTimeString >= slot.start && currentTimeString <= slot.end) {
                    isOpen = true;
                    nextStatusMsg = `Ferme à ${slot.end}`;
                    break;
                }
            }
        }

        if (isOpen) {
            statusDot.className = 'status-dot open';
            statusText.textContent = `Ouvert actuellement · ${nextStatusMsg}`;
            statusText.style.color = '#2ECC71';
        } else {
            statusDot.className = 'status-dot closed';
            
            // Determine when we open next
            let foundNext = false;
            let checkDay = day;
            let dayOffset = 0;

            while (!foundNext && dayOffset < 7) {
                const schedule = openingHours[checkDay];
                
                // If it's today and we haven't opened yet or are between slots
                if (dayOffset === 0) {
                    for (const slot of schedule.slots) {
                        if (currentTimeString < slot.start) {
                            nextStatusMsg = `Ouvre aujourd'hui à ${slot.start}`;
                            foundNext = true;
                            break;
                        }
                    }
                } else {
                    // For future days
                    if (schedule.slots.length > 0) {
                        const dayName = dayOffset === 1 ? 'demain' : schedule.name.toLowerCase();
                        nextStatusMsg = `Ouvre ${dayName} à ${schedule.slots[0].start}`;
                        foundNext = true;
                        break;
                    }
                }

                if (!foundNext) {
                    checkDay = (checkDay + 1) % 7;
                    dayOffset++;
                }
            }

            if (!foundNext) {
                statusText.textContent = 'Fermé actuellement';
            } else {
                statusText.textContent = `Fermé actuellement · ${nextStatusMsg}`;
            }
            statusText.style.color = 'var(--accent-color)';
        }
    }

    checkOpenStatus();
    // Update status check every minute
    setInterval(checkOpenStatus, 60000);

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
