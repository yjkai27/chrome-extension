document.addEventListener('DOMContentLoaded', function() {
    updateDaysLeft();
    updateCurrentTime();
    loadGoal();
    
    const goalDiv = document.getElementById('goal');
    goalDiv.addEventListener('focus', function() {
        if (this.innerText === 'Click here to set your goal') {
            this.innerText = '';
        }
    });

    goalDiv.addEventListener('blur', function() {
        if (this.innerText.trim() === '') {
            this.innerText = 'Click here to set your goal';
        }
        saveGoal(this.innerText);
    });

    document.getElementById('checkGoal').addEventListener('click', function() {
        let goal = goalDiv.innerText.trim();
        if (goal === 'Click here to set your goal' || goal === '') {
            alert('Please set your goal first.');
            return;
        }
        let achieved = confirm('Have you achieved "' + goal + '" today?');
        if (achieved) {
            showConfetti();
        }
    });
});

function updateDaysLeft() {
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    const daysLeft = Math.ceil((endOfYear - now) / (1000 * 60 * 60 * 24));
    document.getElementById('daysLeft').innerText = daysLeft;
}


function updateCurrentTime() {
    const currentTimeDiv = document.getElementById('current-time');
    function refreshTime() {
        const now = new Date();
        currentTimeDiv.innerText = now.toLocaleTimeString();
    }
    refreshTime();
    setInterval(refreshTime, 60000);
}

function loadGoal() {
    if (chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(['goal'], function(result) {
            let goal = result.goal || 'Click here to set your goal';
            document.getElementById('goal').innerText = goal;
        });
    }
}

function saveGoal(goal) {
    if (chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({goal: goal}, function() {
            console.log('Goal saved: ' + goal);
        });
    }
}

function showConfetti() {
    const confettiCanvas = document.getElementById('confetti-wrapper');
    confettiCanvas.style.display = 'block';

    var confetti = window.confetti;

    confetti({
        zIndex: 9999,
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    setTimeout(function() {
        confettiCanvas.style.display = 'none';
    }, 5000);
}

if (typeof window.confetti === 'undefined') {
    console.error('Confetti function is not defined.');
}

