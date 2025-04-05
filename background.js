// Add background styles
const style = document.createElement('style');
style.textContent = `
    .japanese-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        overflow: hidden;
        pointer-events: none;
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(6, 1fr);
    }

    .japanese-char {
        position: relative;
        font-size: clamp(3rem, 8vw, 5rem);
        opacity: 0;
        font-family: "Noto Sans Arabic", "Noto Sans JP", "Noto Sans SC", "Noto Sans KR", "Noto Sans Thai", "Noto Sans Devanagari", sans-serif;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: none;
    }

    @keyframes fade {
        0% { opacity: 0; }
        10% { opacity: 0.8; }
        90% { opacity: 0.8; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Background animation functionality
const mixedChars = [
    'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر',
    '和', '美', '空', '心', '夢', '光', '愛', '桜', '月', '風',
    '龍', '福', '運', '氣', '水', '火', '金', '木', '土', '天',
    '한', '글', '사', '랑', '미', '소', '달', '별', '꿈', '빛',
    'Я', 'Ж', 'Ф', 'Ц', 'Щ', 'Ш', 'Ю', 'Д', 'Л', 'Б',
    'Ω', 'Δ', 'Φ', 'Γ', 'Λ', 'Π', 'Σ', 'Θ', 'Ξ', 'Ψ',
    'अ', 'क', 'म', 'ल', 'स', 'त', 'न', 'द', 'र', 'ह',
    'ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ'
];

// Track active characters and their colors
const activeCharacters = new Set();
let purpleCount = 0;
let greenCount = 0;

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize the grid
function initBackground() {
    const bg = document.getElementById('japaneseBg');
    bg.innerHTML = '';
    
    // Create a copy of mixedChars and shuffle it
    const shuffledChars = shuffleArray([...mixedChars]);
    
    // Create 8x6 grid (48 characters)
    for (let i = 0; i < 48; i++) {
        const char = document.createElement('div');
        char.className = 'japanese-char';
        char.textContent = shuffledChars[i % shuffledChars.length];
        char.style.opacity = '0';
        bg.appendChild(char);
    }

    // Start animation if enabled
    const isAnimated = localStorage.getItem('bgAnimated') !== 'false';
    if (isAnimated) {
        startAnimation();
    } else {
        showAllCharacters();
    }
}

function resetCounters() {
    purpleCount = 0;
    greenCount = 0;
    // Recount existing active characters
    activeCharacters.forEach(char => {
        if (char.style.color.includes('108, 92, 231') || char.style.color.includes('139, 128, 249')) {
            purpleCount++;
        } else {
            greenCount++;
        }
    });
}

function animateRandomChar() {
    const chars = document.querySelectorAll('.japanese-char');
    
    // Periodically reset counters to prevent drift
    if (Math.random() < 0.1) { // 10% chance each cycle
        resetCounters();
    }

    if (activeCharacters.size > 8) {
        const activeArray = Array.from(activeCharacters);
        const charToRemove = activeArray[Math.floor(Math.random() * activeArray.length)];
        // Update color counter when removing a character
        if (charToRemove.style.color.includes('108, 92, 231') || charToRemove.style.color.includes('139, 128, 249')) {
            purpleCount = Math.max(0, purpleCount - 1);
        } else {
            greenCount = Math.max(0, greenCount - 1);
        }
        // Start fade out
        charToRemove.style.animation = 'fade 8s ease-in-out reverse';
        setTimeout(() => {
            charToRemove.style.animation = '';
            charToRemove.style.opacity = '0';
            activeCharacters.delete(charToRemove);
        }, 8000);
    }
    
    const inactiveChars = Array.from(chars).filter(char => !activeCharacters.has(char));
    const shuffledChars = shuffleArray([...mixedChars]);
    
    const charsToAdd = Math.min(2, inactiveChars.length);
    for (let i = 0; i < charsToAdd; i++) {
        if (inactiveChars.length > 0) {
            const randomIndex = Math.floor(Math.random() * inactiveChars.length);
            const randomChar = inactiveChars[randomIndex];
            randomChar.textContent = shuffledChars[Math.floor(Math.random() * shuffledChars.length)];
            
            // Force balance if too uneven
            const isDarkTheme = document.body.classList.contains('dark-theme');
            const forcePurple = purpleCount < greenCount - 2;
            const forceGreen = greenCount < purpleCount - 2;
            
            if (forcePurple || (!forceGreen && Math.random() < 0.5)) {
                randomChar.style.color = isDarkTheme ? 
                    'rgba(139, 128, 249, 0.2)' : 
                    'rgba(108, 92, 231, 0.4)';
                purpleCount++;
            } else {
                randomChar.style.color = isDarkTheme ? 
                    'rgba(72, 187, 120, 0.2)' : 
                    'rgba(72, 187, 120, 0.4)';
                greenCount++;
            }
            
            randomChar.style.animation = 'fade 8s ease-in-out';
            activeCharacters.add(randomChar);
            
            setTimeout(() => {
                if (activeCharacters.has(randomChar)) {
                    // Update counters when character fades out
                    if (randomChar.style.color.includes('108, 92, 231') || randomChar.style.color.includes('139, 128, 249')) {
                        purpleCount = Math.max(0, purpleCount - 1);
                    } else {
                        greenCount = Math.max(0, greenCount - 1);
                    }
                    // Start fade out animation
                    randomChar.style.animation = 'fade 8s ease-in-out reverse';
                    setTimeout(() => {
                        randomChar.style.animation = '';
                        randomChar.style.opacity = '0';
                        activeCharacters.delete(randomChar);
                    }, 8000);
                }
            }, 8000);
            
            inactiveChars.splice(randomIndex, 1);
        }
    }
}

function startAnimation() {
    setInterval(animateRandomChar, 800);
    for (let i = 0; i < 8; i++) {
        setTimeout(animateRandomChar, i * 200);
    }
}

function showAllCharacters() {
    const chars = document.querySelectorAll('.japanese-char');
    chars.forEach(char => {
        // Immediately hide without animation
        char.style.animation = '';
        char.style.opacity = '0';
        activeCharacters.delete(char);
    });
}

function toggleAnimation() {
    const isCurrentlyAnimated = localStorage.getItem('bgAnimated') !== 'false';
    localStorage.setItem('bgAnimated', !isCurrentlyAnimated);
    
    const filmIcon = document.querySelector('.action-icon[onclick="toggleAnimation()"] i');
    if (!isCurrentlyAnimated) {
        startAnimation();
        if (filmIcon) filmIcon.parentElement.classList.add('animated');
    } else {
        stopAnimation();
        showAllCharacters();
        if (filmIcon) filmIcon.parentElement.classList.remove('animated');
    }
}

function stopAnimation() {
    // Clear all intervals
    const highestId = window.setTimeout(() => {}, 0);
    for (let i = 0; i <= highestId; i++) {
        clearInterval(i);
    }
}

// Initialize background when the script loads
document.addEventListener('DOMContentLoaded', initBackground);

// Export functions for use in other files
window.toggleAnimation = toggleAnimation; 