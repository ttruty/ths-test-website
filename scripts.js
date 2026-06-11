// --- Interactive Calculator Logic --- //
const feeSlider = document.getElementById('fee-slider');
const dealsSlider = document.getElementById('deals-slider');
const feeVal = document.getElementById('fee-val');
const dealsVal = document.getElementById('deals-val');
const result = document.getElementById('result');

function updateCalc() {
    if (!feeSlider) return; // Prevent errors if elements don't load
    
    const fee = parseInt(feeSlider.value);
    const deals = parseInt(dealsSlider.value);
    
    feeVal.textContent = '$' + fee.toLocaleString();
    dealsVal.textContent = deals;
    
    // Assume coaching increases deal volume by 30%
    const additionalDeals = deals * 0.30;
    const extraRevenue = additionalDeals * fee;
    
    result.textContent = '+$' + extraRevenue.toLocaleString(undefined, {maximumFractionDigits: 0});
}

function fireConfetti() {
    if (typeof confetti !== 'function') return; // Ensure library loaded
    
    const rect = result.getBoundingClientRect();
    const originX = (rect.left + (rect.width / 2)) / window.innerWidth;
    const originY = (rect.top + (rect.height / 2)) / window.innerHeight;

    confetti({
        particleCount: 60,
        spread: 70,
        origin: { x: originX, y: originY },
        colors: ['#10b981', '#34d399', '#ffffff'], 
        disableForReducedMotion: true,
        zIndex: 1000
    });
}

if(feeSlider && dealsSlider) {
    feeSlider.addEventListener('input', updateCalc);
    dealsSlider.addEventListener('input', updateCalc);
    feeSlider.addEventListener('change', fireConfetti);
    dealsSlider.addEventListener('change', fireConfetti);
}


// --- Feast or Famine Quiz Logic --- //
let totalScore = 0;

// Expose these to the global window object so the inline onclick HTML handlers can find them
window.nextStep = function(stepNumber, points) {
    totalScore += points;
    
    document.querySelectorAll('.quiz-step').forEach(step => {
        step.style.display = 'none';
    });
    
    document.getElementById('step-' + stepNumber).style.display = 'block';
}

window.showResults = function(points) {
    totalScore += points;
    
    document.querySelectorAll('.quiz-step').forEach(step => {
        step.style.display = 'none';
    });
    
    const resultsDiv = document.getElementById('quiz-results');
    const scoreDisplay = document.getElementById('score-display');
    const scoreTitle = document.getElementById('score-title');
    const scoreDesc = document.getElementById('score-desc');
    
    scoreDisplay.textContent = totalScore + '%';
    
    if (totalScore >= 70) {
        scoreDisplay.style.color = '#ef4444'; // Red
        scoreTitle.textContent = "Extreme Famine Risk";
        scoreDesc.textContent = "You are relying entirely on hope and referrals. When your current reqs dry up, you will have a massive gap in revenue. You need an outbound system immediately.";
    } else if (totalScore >= 35) {
        scoreDisplay.style.color = '#f59e0b'; // Yellow/Orange
        scoreTitle.textContent = "Moderate Volatility";
        scoreDesc.textContent = "You have some momentum, but your lack of consistency means you are leaving significant money on the table. It's time to build a repeatable framework.";
    } else {
        scoreDisplay.style.color = '#10b981'; // Green
        scoreTitle.textContent = "Systematic & Stable";
        scoreDesc.textContent = "You have a solid foundation! A discovery call can help you optimize your current engine to scale from 6-figures to 7-figures.";
    }
    
    resultsDiv.style.display = 'block';
}

window.resetQuiz = function(e) {
    e.preventDefault();
    totalScore = 0;
    document.querySelectorAll('.quiz-step').forEach(step => {
        step.style.display = 'none';
    });
    document.getElementById('step-1').style.display = 'block';
}


// --- Substack RSS Fetch Logic --- //
document.addEventListener("DOMContentLoaded", () => {
    const substackRssUrl = 'https://thehonestsalesperson.substack.com/feed';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(substackRssUrl)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('substack-feed');
            if(!container) return;
            
            container.innerHTML = ''; 
            
            const latestPosts = data.items.slice(0, 3);

            latestPosts.forEach(post => {
                const pubDate = new Date(post.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const cleanSnippet = post.description.replace(/<[^>]*>?/gm, '').substring(0, 130) + '...';

                const postCardHtml = `
                    <div class="surface-box" style="display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <span style="font-size: 0.85rem; color: var(--accent-color); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">${pubDate}</span>
                            <h3 style="margin-top: 0.75rem; font-size: 1.3rem; line-height: 1.4;">
                                <a href="${post.link}" target="_blank" style="color: var(--primary-color);">${post.title}</a>
                            </h3>
                            <p style="font-size: 1rem; color: var(--text-main); margin-bottom: 1.5rem;">${cleanSnippet}</p>
                        </div>
                        <a href="${post.link}" target="_blank" style="font-weight: 600; color: var(--accent-color); display: inline-flex; align-items: center; gap: 0.5rem;">
                            Read Article <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                `;
                container.innerHTML += postCardHtml;
            });
        })
        .catch(error => {
            const container = document.getElementById('substack-feed');
            if(container) {
                 container.innerHTML = '<p style="text-align: center; color: var(--text-light);">Unable to load articles right now. Please visit the Substack directly.</p>';
            }
        });
});
