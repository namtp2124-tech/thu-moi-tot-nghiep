document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const CONFIG = {
        // Target Date: July 5th, 2026, 10:00 AM GMT+7
        graduationDate: new Date('2026-07-05T10:00:00+07:00').getTime(),
        // Zalo Phone Number (Change this to your real phone number, e.g. "0969888888")
        zaloPhoneNumber: "0969999999",
        // Max particles in background
        maxParticles: 20,
        // Google Sheets Apps Script Web App URL (Paste your URL here, e.g. "https://script.google.com/macros/s/xxxx/exec")
        googleSheetUrl: ""
    };

    /* ==========================================================================
       1. BACKGROUND PARTICLES GENERATOR
       ========================================================================== */
    const particlesContainer = document.getElementById('particles-container');
    
    function createParticle() {
        if (!particlesContainer) return;
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 3px and 6px
        const size = Math.random() * 3 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random horizontal position
        particle.style.left = `${Math.random() * 100}vw`;
        
        // Random animation duration between 6s and 12s
        const duration = Math.random() * 6 + 6;
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation ends to save memory
        setTimeout(() => {
            particle.remove();
            createParticle();
        }, (duration + 5) * 1000);
    }

    // Initialize particles
    for (let i = 0; i < CONFIG.maxParticles; i++) {
        setTimeout(createParticle, i * 300);
    }

    /* ==========================================================================
       2. AUDIO PLAYER MANAGER
       ========================================================================== */
    const musicToggleBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    let isMusicPlaying = false;

    if (musicToggleBtn && bgMusic) {
        // Set lower volume for background comfort
        bgMusic.volume = 0.4;

        function playAudio() {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicToggleBtn.classList.add('playing');
            }).catch(err => {
                console.log("Autoplay blocked by browser. Awaiting interaction.", err);
            });
        }

        function pauseAudio() {
            bgMusic.pause();
            isMusicPlaying = false;
            musicToggleBtn.classList.remove('playing');
        }

        // Click toggle button
        musicToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isMusicPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        });

        // Autoplay on first human interaction
        const autoPlayHandler = () => {
            if (!isMusicPlaying) {
                playAudio();
            }
            // Remove event listeners once triggered
            window.removeEventListener('click', autoPlayHandler);
            window.removeEventListener('touchstart', autoPlayHandler);
            window.removeEventListener('scroll', autoPlayHandler);
        };

        window.addEventListener('click', autoPlayHandler);
        window.addEventListener('touchstart', autoPlayHandler);
        window.addEventListener('scroll', autoPlayHandler);
    }

    /* ==========================================================================
       3. PRECISION COUNTDOWN TIMER
       ========================================================================== */
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = CONFIG.graduationDate - now;

        if (difference <= 0) {
            // Event has started / passed
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minsEl) minsEl.innerText = "00";
            if (secsEl) secsEl.innerText = "00";
            
            const countdownTitle = document.querySelector('.countdown-title');
            if (countdownTitle) {
                countdownTitle.innerHTML = "🎓 BUỔI LỄ ĐANG DIỄN RA HOẶC ĐÃ HOÀN THÀNH!";
                countdownTitle.style.color = "#d4af37";
            }
            return;
        }

        // Time calculations
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Render to DOM with leading zero padding
        if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
        if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
        if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');
    }

    // Run immediately and update every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* ==========================================================================
       4. RSVP FORM & COPY LOGIC
       ========================================================================== */
    const rsvpForm = document.getElementById('rsvp-form');
    const successModal = document.getElementById('success-modal');
    const modalCloseBtn = document.getElementById('btn-modal-close');
    const modalZaloBtn = document.getElementById('btn-modal-zalo');

    if (modalZaloBtn) {
        modalZaloBtn.addEventListener('click', () => {
            alert("Đã sao chép lời chúc vào bộ nhớ tạm. Hãy dán (Paste) vào ô chat Zalo với Nam nhé!");
        });
    }

    if (rsvpForm) {
        const btnSubmit = document.getElementById('btn-submit-rsvp');
        const originalBtnHtml = btnSubmit ? btnSubmit.innerHTML : '';

        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const guestName = document.getElementById('guest-name').value.trim();
            const attendance = document.querySelector('input[name="attendance"]:checked').value;
            const guestMessage = document.getElementById('guest-message').value.trim();

            // Show loading state
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...`;
            }

            // Construct text message
            let rsvpText = `🎓 XÁC NHẬN THAM DỰ LỄ TỐT NGHIỆP\n`;
            rsvpText += `------------------------------\n`;
            rsvpText += `👤 Khách mời: ${guestName}\n`;
            rsvpText += `✅ Trạng thái: ${attendance === 'có' ? 'Sẽ đến tham dự vui cùng Nam 🎉' : 'Rất tiếc không thể đến 😢'}\n`;
            if (guestMessage) {
                rsvpText += `✉️ Lời chúc: "${guestMessage}"`;
            }

            // Helper to complete RSVP flow (copy to clipboard and show modal)
            const completeRsvp = () => {
                navigator.clipboard.writeText(rsvpText).then(() => {
                    console.log("RSVP copied to clipboard!");
                    
                    const zaloUrl = `https://zalo.me/${CONFIG.zaloPhoneNumber}`;
                    if (modalZaloBtn) {
                        modalZaloBtn.href = zaloUrl;
                    }

                    // Reset button state
                    if (btnSubmit) {
                        btnSubmit.disabled = false;
                        btnSubmit.innerHTML = originalBtnHtml;
                    }

                    // Show Success Modal
                    if (successModal) {
                        successModal.classList.add('active');
                    }
                }).catch(err => {
                    console.error("Could not copy RSVP text: ", err);
                    // Reset button state
                    if (btnSubmit) {
                        btnSubmit.disabled = false;
                        btnSubmit.innerHTML = originalBtnHtml;
                    }
                    alert("Đã gửi thông tin! Cảm ơn bạn rất nhiều!");
                });
            };

            // Post to Google Sheet Web App if URL is configured
            if (CONFIG.googleSheetUrl) {
                const payload = {
                    guestName: guestName,
                    attendance: attendance === 'có' ? 'Có tham gia' : 'Rất tiếc không thể đến',
                    guestMessage: guestMessage
                };

                fetch(CONFIG.googleSheetUrl, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8' // Bypasses preflight CORS preflight
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => {
                    console.log("Stored to Google Sheets successfully:", response);
                    completeRsvp();
                })
                .catch(err => {
                    console.error("Failed to store to Google Sheets (falling back to local clipboard/Zalo):", err);
                    completeRsvp();
                });
            } else {
                // Direct fallback if no sheet is configured
                completeRsvp();
            }
        });
    }

    // Modal controls
    if (modalCloseBtn && successModal) {
        modalCloseBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            if (rsvpForm) rsvpForm.reset();
        });
    }

    // Close modal when clicking outside card
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                if (rsvpForm) rsvpForm.reset();
            }
        });
    }
});
