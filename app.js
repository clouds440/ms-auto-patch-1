document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const numInput = document.getElementById('num');
    const delayButton = document.getElementById('delay');
    const timeDisplay = document.getElementById('time');
    const timerDisplay = document.getElementById('timer');
    const stopButton = document.getElementById('btnStop');
    const countDisplay = document.getElementById('count');
    const totalDisplay = document.getElementById('total');
  
    // Default delay and toggle state
    let delay = 7000;
    let delayEnabled = false;
    let stopLoop = true;
    let intervalId;
  
    // Set default value based on the device type
    numInput.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 20 : 30;
  
    // Ensure input value is within bounds
    numInput.addEventListener('blur', () => {
      if (numInput.value < 1 || numInput.value > 50) numInput.value = 1;
      updateTime();
    });
  
    // Update the time display when the input changes
    numInput.addEventListener('input', updateTime);
  
    // Function to update the total time required
    function updateTime() {
      timeDisplay.textContent = Math.ceil(numInput.value * (delay / 1000 + 0.5));
    }
  
    // Set the number input value and update the time
    window.setNumber = function (value) {
      numInput.value = value;
      updateTime();
    };
  
    // Adjust the number input value by a given increment and update the time
    window.adjustNumber = function (value) {
      numInput.value = parseInt(numInput.value) + value;
      updateTime();
    };
  
    // Toggle delay between two values and update button color and time
    window.toggleDelay = function () {
      delayEnabled = !delayEnabled;
      delay = delayEnabled ? 12000 : 7000;
      delayButton.style.backgroundColor = delayEnabled ? 'red' : 'rgba(6, 144, 243, 0.836)';
      updateTime();
    };
  
    // Start a countdown timer for the duration of the search
    function startTimer(duration) {
      let timer = duration;
      timerDisplay.textContent = `${timer} seconds remaining`;
      timerDisplay.classList.remove('hidden');
  
      intervalId = setInterval(() => {
        timerDisplay.textContent = `${--timer} seconds remaining`;
        if (timer < 0) {
          clearInterval(intervalId);
          timerDisplay.classList.add('hidden');
        }
      }, 1000);
    }
  
    // Stop the search loop and hide the timer
    stopButton.addEventListener('click', () => {
      stopLoop = true;
      clearInterval(intervalId);
      timerDisplay.classList.add('hidden');
      stopButton.classList.add('hidden');
    });
  
    // Handle form submission to start searches
    document.getElementById('searchForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      stopLoop = false;
      const num = numInput.value;
      totalDisplay.textContent = num;
      startTimer(Math.ceil(num * (delay / 1000 + 0.5)));
      await sleep(1000);
      performRandomSearches(num);
    });
  
    // Perform the specified number of random searches
    async function performRandomSearches(num) {
      stopButton.classList.remove('hidden');
      for (let i = 0; i < num && !stopLoop; i++) {
        countDisplay.textContent = i + 1;
        const randomWord = await getRandomWord();
        const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(randomWord)}`;
        const win = window.open(searchUrl, '_blank');
        await sleep(delay);
        win.close();
        await sleep(500);
      }
      stopButton.classList.add('hidden');
    }
  
    // Fetch a random word from a JSON file
    async function getRandomWord() {
      try {
        const response = await fetch('words.json');
        if (!response.ok) throw new Error('Failed to load words.json');
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex].word;
      } catch (error) {
        console.error('Error loading words.json:', error);
        return 'error';
      }
    }
  
    // Utility function to create a delay
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    // Initialize time display
    updateTime();
  });  