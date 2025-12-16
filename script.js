// Configuration: Add your links here for each day
const surpriseLinks = {
    1: "IMG_5765.HEIC", // Add link for December 1st
    2: "IMG_0586.HEIC",
    3: "IMG_0612.heic",
    4: "IMG_0659.HEIC",
    5: "IMG_0684.HEIC",
    6: "IMG_0742.HEIC",
    7: "IMG_1506.HEIC",
    8: "IMG_2453.HEIC",
    9: "4a475c30-89b6-4ae6-b4b7-172c465fdd70.JPG",
    10: "11fd96cb-b523-41b5-b6a6-9509c9f1115d.JPG",
    11: "411dd764-503d-4193-87e6-163f823dcd55.JPG",
    12: "D18AE0FF-A6B1-4E36-BE62-25CB9D1F4079.JPG",
    13: "Gold Luxury Happy Birthday Video.jpg",
    14: "IMG_4475.HEIC",
    15: "IMG_3746.HEIC",
    16: "IMG_6376.HEIC",
    17: "IMG_6350.HEIC",
    18: "IMG_7077.HEIC",
    19: "IMG_7466.HEIC",
    20: "IMG_7487.HEIC",
    21: "IMG_8054.HEIC",
    22: "IMG_9396.HEIC",
    23: "IMG_9403.HEIC",
    24: "IMG_9717.JPG",
    25: "56afe610-98ed-45fd-89e5-a2b21c7c47f3.JPG"
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







