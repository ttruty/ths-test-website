// --- First-Time Visitor Dialogue Logic --- //
document.addEventListener("DOMContentLoaded", () => {
    // UPDATED: These IDs now match your new HTML perfectly
    const popup = document.getElementById('welcome-dialogue');
    const closeBtn = document.getElementById('dialogue-close-x');
    const dismissText = document.getElementById('dialogue-dismiss');
    const ctaBtn = document.getElementById('dialogue-cta');
    
    // Debugging lines 

    // Safely exit if the popup isn't on this page
    if (!popup) return;

    // Check the browser's local storage to see if they have visited before
    const hasVisited = localStorage.getItem('ths_first_visit_cleared');

    if (!hasVisited) {
        // Wait 2.5 seconds before showing the popup so it's not aggressively instant
        setTimeout(() => {
            popup.style.display = 'flex'; 
            
            // Small delay to allow the browser to register the display change before applying the fade animation
            setTimeout(() => {
                popup.classList.add('show');
            }, 10);
            
        }, 2500); 
    }

    // Function to close the popup and set the local storage flag
    const closePopup = () => {
        popup.classList.remove('show');
        
        // Wait for the fade-out animation to finish before removing it from the document flow
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300); 
        
        // Mark the user as a returning visitor forever
        localStorage.setItem('ths_first_visit_cleared', 'true');
    };

    // Close triggers
    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (dismissText) dismissText.addEventListener('click', closePopup);
    if (ctaBtn) ctaBtn.addEventListener('click', closePopup); // Also close it if they click the primary button

    // Close if they click the dark background outside the white box
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });
});