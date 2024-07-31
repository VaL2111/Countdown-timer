const dom = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
};

let countdownValues = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
};

let countdownInterval;
let isRunning = false;
let remainingTime = null;
let isBackPressed = true;

function startCountdown(duration)
{
    const endTime = Date.now() + duration;

    countdownInterval = setInterval(() => {
        const currentTime = Date.now();
        const timeLeft = endTime - currentTime;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            alert("Час вийшов!");
            isRunning = false;
            remainingTime = null;
            changePlayPauseButton();
            resetCountdownValues();
            renderTime(countdownValues, dom);

            const emptyCircle = 0;
            fillOrEmptyCircle(emptyCircle);
        } else {
            remainingTime = timeLeft;
            const formattedTime = getFormattedTime(timeLeft);
            renderTime(formattedTime, dom);
        }
    });
}

function resetCountdownValues()
{
    for (let key in countdownValues) {
        countdownValues[key] = 0;
    }
}

function getTotalMilliseconds(time)
{
    return ((time.days * 24 * 60 * 60) + (time.hours * 60 * 60) + (time.minutes * 60) + time.seconds) * 1000;
}

function getFormattedTime(time)
{
    return {
        days: Math.floor(time / (1000 * 60 * 60 * 24)),
        hours: Math.floor(time % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
        minutes: Math.floor(time % (1000 * 60 * 60) / (1000 * 60)),
        seconds: Math.floor(time % (1000 * 60) / 1000),
    };
}

function renderTime(countdownData, dom)
{
    for(const [key, value] of Object.entries(countdownData)) {
        const timerItem = dom[key];

        const segment = timerItem.querySelector('.segment');
        const timerNumber = timerItem.querySelector('.timer-item-number');
        timerNumber.innerHTML = value;

        changeCircleSegment(segment, key, value);
    }
}

function changeCircleSegment(element, key, value)
{
    const style = element.style;
    let segment;

    switch (key) {
        case 'minutes':
        case 'seconds':
            segment = value;
            break;
        case 'hours':
            segment = 60 / 24 * value;
            break;
        case 'days':
            segment = 60 / 7 * value;
            break;
    }

    style.strokeDasharray = `${segment} 60`;
    style.strokeLinecap = value ? 'round' : 'initial';
}

function fillOrEmptyCircle(element)
{
    for (let key in countdownValues) {
        const segment = dom[key].querySelector('.segment');
        const style = segment.style;
        style.strokeDasharray = `${element} 60`;
    }
}

const timeUnits = ['days', 'hours', 'minutes', 'seconds'];

timeUnits.forEach(unit => {
    const element = dom[unit].querySelector('.timer-item-number');
    element.addEventListener('wheel', (event) => {
        if (isBackPressed) {
            event.preventDefault();

            updateCountdownValues(unit, event.deltaY);
            checkCountdownValues(unit);

            element.innerHTML = countdownValues[unit];
        }
    });
});

function updateCountdownValues(unit, deltaY)
{
    countdownValues[unit] += (deltaY < 0) ? 1 : -1;
}

function checkCountdownValues(unit)
{
    const maxValues = {
        days: 99,
        hours: 23,
        minutes: 59,
        seconds: 59,
    };

    if (countdownValues[unit] > maxValues[unit]) {
        countdownValues[unit] = maxValues[unit];
    } else if (countdownValues[unit] < 0) {
        countdownValues[unit] = 0;
    }
}

const playPauseButton = document.querySelector('.swap img');

function changePlayPauseButton()
{
    playPauseButton.src = (isRunning) ? '/images-svg/pause.svg' : '/images-svg/play.svg';
}

playPauseButton.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(countdownInterval);
        isRunning = false;
    } else {
        if (remainingTime === null || isBackPressed) {
            remainingTime = getTotalMilliseconds(countdownValues);
        }

        isRunning = true;
        startCountdown(remainingTime);
    }

    isBackPressed = false;
    changePlayPauseButton();
});

const backButton = document.getElementById('back_button');

backButton.addEventListener('click', () => {
    clearInterval(countdownInterval);
    isRunning = false;
    isBackPressed = true;
    changePlayPauseButton();
    remainingTime = getTotalMilliseconds(countdownValues);
    renderTime(countdownValues, dom);

    const fillCircle = 60;
    fillOrEmptyCircle(fillCircle);
});
