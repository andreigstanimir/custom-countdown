const inputContainer = document.querySelector('.input-container');
const inputTitle = document.querySelector('.title');
const countdownForm = document.querySelector('.countdown-form');
const dateEl = document.querySelector('.date-picker');

const countdownEl = document.querySelector('.countdown');
const countdownElTitle = document.querySelector('.countdown-title');
const countdownButton = document.querySelector('.countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.querySelector('.complete');
const completeElInfo = document.querySelector('.complete-info');
const completeBtn = document.querySelector('.complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000; // milliseconds
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min with Today's Date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Populate Countdown / Complete UI
const updateDOM = function () {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    // Hide Input
    inputContainer.hidden = true;

    // If the countdown has ended, show complete
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      // Else, show the countdown in progress
      // Populate countdown
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
};

// Take values from form input
const updateCountdown = function (event) {
  event.preventDefault();
  countdownTitle = event.target[0].value;
  countdownDate = event.target[1].value;

  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };

  localStorage.setItem('countdown', JSON.stringify(savedCountdown));

  // Check for valid date
  if (countdownDate === '') {
    alert('Please select a date for the countdown.');
  } else {
    // Get number version of current Date, update DOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
};

const reset = function () {
  // Hide countdowns, show Input
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  // Stop countdown
  clearInterval(countdownActive);
  // Reset values
  countdownTitle = '';
  countdownDate = '';
  // Clear inputs
  inputTitle.value = '';
  dateEl.value = '';
  // Reset localStorage
  localStorage.removeItem('countdown');
};

const restorePreviousCountdown = function () {
  // Get countdown from localStorage if available
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
};

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownButton.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On Load, check localStorage
restorePreviousCountdown();
