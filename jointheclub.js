// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('membershipForm');
    const formMessage = document.getElementById('formMessage');
    let submitButton;

    // Only try to get submitButton if form exists
    if (form) {
        submitButton = form.querySelector('.submit-button');
    }

    // Check if all required elements exist
    if (!form || !formMessage || !submitButton) {
        console.error('Required form elements not found');
        return; // Exit early if elements are missing
    }

    function openModal() {
        const modal = document.getElementById('membershipModal');
        if (!modal) return;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const modal = document.getElementById('membershipModal');
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (form) {
            form.reset();
            if (formMessage) {
                formMessage.className = 'form-message';
                formMessage.style.display = 'none';
            }
        }
    }

    // Make functions available globally
    window.openModal = openModal;
    window.closeModal = closeModal;

    window.onclick = function(event) {
        const modal = document.getElementById('membershipModal');
        if (event.target == modal) {
            closeModal();
        }
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        try {
            // Collect form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: `Callsign: ${document.getElementById('callsign').value}\nPhone: ${document.getElementById('phone').value}\nAddress: ${document.getElementById('address').value}\nInterests: ${document.getElementById('interests').value}`,
            };

            const response = await fetch('https://script.google.com/macros/s/AKfycbxdvte_LbrvlamOlXK54R0vUf98qrLYvmSOqwbUbcmbV-VF1l_6MKezJVVwC_l6ASLK/exec', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(formData),
                mode: 'no-cors' // Add this line
            });

            // Since we're using no-cors, we won't get response data
            // Instead, assume success if the request didn't throw an error
            formMessage.textContent = 'Thank you for your application! We will be in touch soon.';
            formMessage.className = 'form-message success';
            formMessage.style.display = 'block';
            form.reset();
            setTimeout(closeModal, 3000);

        } catch (error) {
            console.error('Submission error:', error);
            formMessage.textContent = 'Sorry, there was a problem submitting your application. Please try again.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    });
});