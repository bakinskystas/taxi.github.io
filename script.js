let money = 0;
let trips = 0;
let experience = 0;
let level = 1;

let moneyPerTrip = 300;
let upgradeCarCost = 200;
let upgradeSpeedCost = 400;
let upgradeFuelCost = 300;
let upgradeComfortCost = 500;
let upgradeGPSCost = 600;
let upgradeEntertainmentCost = 700;

let tripTime = 60000; // 1 minute in milliseconds
let fuelConsumption = 1; // units per trip

let isDriving = false;

const missions = [
    { description: "Перевезти 10 пассажиров", reward: 100, target: 10, type: "trips" },
    { description: "Заработать 500 руб.", reward: 200, target: 500, type: "money" },
    { description: "Достичь 2 уровня", reward: 150, target: 2, type: "level" }
];

let activeMission = null;

document.getElementById('driveButton').addEventListener('click', () => {
    if (isDriving) return;

    isDriving = true;
    showModal('mapModal');

    const tripStartTime = Date.now();
    const tripInterval = setInterval(() => {
        const elapsedTime = Date.now() - tripStartTime;
        const remainingTime = Math.max(tripTime - elapsedTime, 0);
        document.getElementById('timer').innerText = `Осталось: ${Math.ceil(remainingTime / 1000)} сек.`;

        if (elapsedTime >= tripTime) {
            clearInterval(tripInterval);
            isDriving = false;
            hideModal('mapModal');
            processTrip();
            updateStats();
            saveGame();
        }
    }, 1000);

    startMiniMapAnimation();
});

document.getElementById('upgradeCarButton').addEventListener('click', () => {
    if (money >= upgradeCarCost) {
        money -= upgradeCarCost;
        moneyPerTrip += 50;
        upgradeCarCost *= 2;
        document.getElementById('upgradeCarButton').innerText = `Улучшить машину (${upgradeCarCost} руб.)`;
        updateStats();
        saveGame();
    }
});

document.getElementById('upgradeSpeedButton').addEventListener('click', () => {
    if (money >= upgradeSpeedCost) {
        money -= upgradeSpeedCost;
        tripTime = Math.max(tripTime - 5000, 30000); // Reduce trip time, minimum 30 seconds
        upgradeSpeedCost *= 2;
        document.getElementById('upgradeSpeedButton').innerText = `Улучшить скорость (${upgradeSpeedCost} руб.)`;
        updateStats();
        saveGame();
    }
});

document.getElementById('upgradeFuelButton').addEventListener('click', () => {
    if (money >= upgradeFuelCost) {
        money -= upgradeFuelCost;
        fuelConsumption = Math.max(fuelConsumption - 0.1, 0.5); // Reduce fuel consumption, minimum 0.5 units
        upgradeFuelCost *= 2;
        document.getElementById('upgradeFuelButton').innerText = `Экономия топлива (${upgradeFuelCost} руб.)`;
        updateStats();
        saveGame();
    }
});

document.getElementById('upgradeComfortButton').addEventListener('click', () => {
    if (money >= upgradeComfortCost) {
        money -= upgradeComfortCost;
        moneyPerTrip += 50;
        upgradeComfortCost *= 2;
        document.getElementById('upgradeComfortButton').innerText = `Улучшить комфорт (${upgradeComfortCost} руб.)`;
        updateStats();
        saveGame();
    }
});

document.getElementById('upgradeGPSButton').addEventListener('click', () => {
    if (money >= upgradeGPSCost) {
        money -= upgradeGPSCost;
        tripTime = Math.max(tripTime - 5000, 30000);
        upgradeGPSCost *= 2;
        document.getElementById('upgradeGPSButton').innerText = `Установить GPS (${upgradeGPSCost} руб.)`;
        updateStats();
        saveGame();
    }
});

document.getElementById('upgradeEntertainmentButton').addEventListener('click', () => {
    if (money >= upgradeEntertainmentCost) {
        money -= upgradeEntertainmentCost;
        moneyPerTrip += 50;
        upgradeEntertainmentCost *= 2;
        document.getElementById('upgradeEntertainmentButton').innerText = `Установить развлекательную систему (${upgradeEntertainmentCost} руб.)`;
        updateStats();
        saveGame();
    }
});

document.getElementById('missionButton').addEventListener('click', () => {
    if (!activeMission) {
        activeMission = missions[Math.floor(Math.random() * missions.length)];
        showNotification(`Новая миссия: ${activeMission.description}`);
    } else {
        showNotification(`Вы уже выполняете миссию: ${activeMission.description}`);
    }
    updateStats();
    saveGame();
});

document.getElementById('closeNotification').addEventListener('click', () => {
    hideNotification();
});

document.getElementById('openUpgradesButton').addEventListener('click', () => {
    showModal('upgradesModal');
});

document.getElementById('closeUpgradesButton').addEventListener('click', () => {
    hideModal('upgradesModal');
});

document.getElementById('closeMapButton').addEventListener('click', () => {
    hideModal('mapModal');
    clearInterval(mapInterval);
    isDriving = false;
});

document.getElementById('resetButton').addEventListener('click', () => {
    localStorage.removeItem('taxiSimulatorGameState');
    money = 0;
    trips = 0;
    experience = 0;
    level = 1;
    moneyPerTrip = 300;
    upgradeCarCost = 200;
    upgradeSpeedCost = 400;
    upgradeFuelCost = 300;
    upgradeComfortCost = 500;
    upgradeGPSCost = 600;
    upgradeEntertainmentCost = 700;
    tripTime = 60000;
    fuelConsumption = 1;
    activeMission = null;
    isDriving = false;
    updateStats();
    showNotification('Игра сброшена.');
});

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    notificationMessage.innerText = message;
    notification.classList.remove('hidden');
}

function hideNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('hidden');
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('hidden');
}

function processTrip() {
    let tripMoney = moneyPerTrip + Math.floor(Math.random() * 100); // Random bonus between 0 and 100
    let tripExperience = 5 + Math.floor(Math.random() * 5); // Random bonus between 0 and 5
    let eventChance = Math.random();

    if (eventChance < 0.05) {
        tripMoney -= 100; // Accident
        showNotification('Авария! Вы потеряли 100 руб.');
    } else if (eventChance < 0.10) {
        tripMoney += 50; // Bonus trip
        showNotification('Бонусная поездка! Вы заработали дополнительно 50 руб.');
    }

    money += tripMoney;
    trips += 1;
    experience += tripExperience;

    if (experience >= level * 100) {
        experience -= level * 100;
        level += 1;
        showNotification(`Поздравляем! Вы достигли уровня ${level}!`);
    }

    checkMissionCompletion();
}

function checkMissionCompletion() {
    if (activeMission) {
        let completed = false;
        switch (activeMission.type) {
            case "trips":
                completed = trips >= activeMission.target;
                break;
            case "money":
                completed = money >= activeMission.target;
                break;
            case "level":
                completed = level >= activeMission.target;
                break;
        }

        if (completed) {
            money += activeMission.reward;
            showNotification(`Миссия выполнена! Вы получили ${activeMission.reward} руб.`);
            activeMission = null;
            saveGame();
        }
    }
}

function updateStats() {
    document.getElementById('money').innerText = money;
    document.getElementById('trips').innerText = trips;
    document.getElementById('experience').innerText = experience;
    document.getElementById('level').innerText = level;
    document.getElementById('upgradeCarButton').disabled = money < upgradeCarCost;
    document.getElementById('upgradeSpeedButton').disabled = money < upgradeSpeedCost;
    document.getElementById('upgradeFuelButton').disabled = money < upgradeFuelCost;
    document.getElementById('upgradeComfortButton').disabled = money < upgradeComfortCost;
    document.getElementById('upgradeGPSButton').disabled = money < upgradeGPSCost;
    document.getElementById('upgradeEntertainmentButton').disabled = money < upgradeEntertainmentCost;
    document.getElementById('missionButton').innerText = activeMission ? `Миссия: ${activeMission.description}` : 'Выполнить миссию';
}

function saveGame() {
    const gameState = {
        money,
        trips,
        experience,
        level,
        moneyPerTrip,
        upgradeCarCost,
        upgradeSpeedCost,
        upgradeFuelCost,
        upgradeComfortCost,
        upgradeGPSCost,
        upgradeEntertainmentCost,
        tripTime,
        fuelConsumption,
        activeMission,
        isDriving
    };
    localStorage.setItem('taxiSimulatorGameState', JSON.stringify(gameState));
}

function loadGame() {
    const savedGameState = localStorage.getItem('taxiSimulatorGameState');
    if (savedGameState) {
        const gameState = JSON.parse(savedGameState);
        money = gameState.money;
        trips = gameState.trips;
        experience = gameState.experience;
        level = gameState.level;
        moneyPerTrip = gameState.moneyPerTrip;
        upgradeCarCost = gameState.upgradeCarCost;
        upgradeSpeedCost = gameState.upgradeSpeedCost;
        upgradeFuelCost = gameState.upgradeFuelCost;
        upgradeComfortCost = gameState.upgradeComfortCost;
        upgradeGPSCost = gameState.upgradeGPSCost;
        upgradeEntertainmentCost = gameState.upgradeEntertainmentCost;
        tripTime = gameState.tripTime;
        fuelConsumption = gameState.fuelConsumption;
        activeMission = gameState.activeMission;
        isDriving = gameState.isDriving;
    }
    updateStats();
}

let mapInterval;

function startMiniMapAnimation() {
    const canvas = document.getElementById('miniMap');
    const ctx = canvas.getContext('2d');

    const roadSegments = [
        { x1: 50, y1: 50, x2: 250, y2: 50 },
        { x1: 250, y1: 50, x2: 250, y2: 250 },
        { x1: 250, y1: 250, x2: 50, y2: 250 },
        { x1: 50, y1: 250, x2: 50, y2: 50 }
    ];

    const car = { x: 50, y: 50, radius: 5 };
    let currentSegmentIndex = 0;
    let stopped = false;
    let stopTime = 0;

    function drawRoads() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#000';

        for (const segment of roadSegments) {
            ctx.beginPath();
            ctx.moveTo(segment.x1, segment.y1);
            ctx.lineTo(segment.x2, segment.y2);
            ctx.stroke();
        }
    }

    function drawCar() {
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc(car.x, car.y, car.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    function animateCar() {
        if (!stopped) {
            const segment = roadSegments[currentSegmentIndex];
            const dx = segment.x2 - segment.x1;
            const dy = segment.y2 - segment.y1;
            const segmentLength = Math.sqrt(dx * dx + dy * dy);
            const speed = 2; // Adjust the speed here

            if ((Math.abs(car.x - segment.x2) <= speed) && (Math.abs(car.y - segment.y2) <= speed)) {
                stopped = true;
                stopTime = Date.now();
            } else {
                const normDx = dx / segmentLength;
                const normDy = dy / segmentLength;
                car.x += normDx * speed;
                car.y += normDy * speed;
            }
        } else {
            if (Date.now() - stopTime >= 5000) { // Stop for 5 seconds
                stopped = false;
                currentSegmentIndex = (currentSegmentIndex + 1) % roadSegments.length;
            }
        }

        drawRoads();
        drawCar();
    }

    mapInterval = setInterval(animateCar, 1000 / 60); // 60 FPS
}

window.onload = () => {
    loadGame();
    updateStats();
};
