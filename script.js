// Configuration: Add your links here for each day
const surpriseLinks = {
    1: "https://www.lequipe.fr/", // Add link for December 1st
    2: "IMG_5765.HEIC",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: "",
    10: "",
    11: "",
    12: "",
    13: "",
    14: "",
    15: "",
    16: "",
    17: "",
    18: "",
    19: "",
    20: "",
    21: "",
    22: "",
    23: "",
    24: "",
    25: ""
};

// Initialize the calendar
const calendarGrid = document.getElementById('calendar');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeBtn');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalLink = document.getElementById('modalLink');

// Get opened doors from localStorage
let openedDoors = JSON.parse(localStorage.getItem('adventOpenedDoors')) || [];

// Create snow effect
function createSnow() {
    const snowContainer = document.querySelector('.snow-container');
    const snowflakeCount = 50;
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.innerHTML = '❄';
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        snowflake.style.fontSize = (Math.random() * 1 + 0.5) + 'em';
        snowContainer.appendChild(snowflake);
    }
}

// Create confetti effect
function createConfetti(element) {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800'];
    const confettiCount = 30;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 0.3 + 's';
        element.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 2000);
    }
}

// Check if a day is available
function isDayAvailable(day) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    const currentDay = now.getDate();
    
    // For testing purposes, you can uncomment the line below to make all days available
    // return true;
    
    // Check if we're in December
    if (currentMonth === 11) { // December is month 11
        return day <= currentDay;
    }
    
    // If we're past December, all days are available
    if (currentMonth > 11 || (currentMonth === 0 && currentDay > 25)) {
        return true;
    }
    
    return false;
}

// Create calendar doors
function createCalendar() {
    const days = Array.from({length: 25}, (_, i) => i + 1);
    
    // Shuffle days for a more random appearance
    days.sort(() => Math.random() - 0.5);
    
    days.forEach(day => {
        const door = document.createElement('div');
        door.classList.add('calendar-door');
        
        const isAvailable = isDayAvailable(day);
        const isOpened = openedDoors.includes(day);
        
        if (isOpened) {
            door.classList.add('opened');
        } else if (isAvailable) {
            door.classList.add('available');
        } else {
            door.classList.add('locked');
        }
        
        door.innerHTML = `
            <div class="door-number">${day}</div>
            <div class="door-icon">${isOpened ? '✨' : isAvailable ? '🎁' : '🔒'}</div>
        `;
        
        door.addEventListener('click', () => handleDoorClick(day, door, isAvailable, isOpened));
        
        calendarGrid.appendChild(door);
    });
}

// Handle door click
function handleDoorClick(day, doorElement, isAvailable, isOpened) {
    if (!isAvailable) {
        // Shake animation for locked doors
        doorElement.style.animation = 'none';
        setTimeout(() => {
            doorElement.style.animation = 'shake 0.5s';
        }, 10);
        
        showModal(day, false, isOpened);
        return;
    }
    
    // Add opening animation
    doorElement.classList.add('opening');
    createConfetti(doorElement);
    
    setTimeout(() => {
        doorElement.classList.remove('opening');
        
        if (!isOpened) {
            doorElement.classList.remove('available');
            doorElement.classList.add('opened');
            doorElement.querySelector('.door-icon').textContent = '✨';
            
            // Save to localStorage
            openedDoors.push(day);
            localStorage.setItem('adventOpenedDoors', JSON.stringify(openedDoors));
        }
        
        showModal(day, true, isOpened);
    }, 800);
}

// Show modal
function showModal(day, canOpen, wasOpened) {
    modalTitle.textContent = `Day ${day}`;
    
    if (!canOpen) {
        modalMessage.textContent = `This door is still locked! Come back on December ${day}th! 🔒`;
        modalLink.style.display = 'none';
    } else {
        if (wasOpened) {
            modalMessage.textContent = `You already opened this surprise! Click below to view it again. 🎄`;
        } else {
            modalMessage.textContent = `🎉 Congratulations! You've unlocked today's surprise! 🎉`;
        }
        
        if (surpriseLinks[day]) {
            modalLink.href = surpriseLinks[day];
            modalLink.style.display = 'inline-block';
        } else {
            modalMessage.textContent += '\n\n(No surprise link set yet)';
            modalLink.style.display = 'none';
        }
    }
    
    modal.style.display = 'block';
}

// Close modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Initialize
createSnow();
createCalendar();


