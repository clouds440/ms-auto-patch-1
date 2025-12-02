document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const numInput = document.getElementById('num');
    const delayButton = document.getElementById('delay');
    const delayLabel = document.getElementById('delayLabel');
    const timeDisplay = document.getElementById('time');
    const timerDisplay = document.getElementById('timer');
    const stopButton = document.getElementById('btnStop');
    const countDisplay = document.getElementById('count');
    const totalDisplay = document.getElementById('total');
    const btnSearch = document.getElementById('btnSearch');
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");

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
      timeDisplay.textContent = Math.ceil(numInput.value * ((delay + 2000) / 1000 + 1));
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
      delay = delayEnabled ? 16000 : 7000;
      delayButton.style.backgroundColor = delayEnabled ? 'red' : 'rgba(6, 144, 243, 0.836)';
      delayLabel.textContent = delayEnabled ? 'Delay: 16s' : 'Delay: 7s';
      updateTime();
    };

    // Set Delay toggled ON by default
    window.toggleDelay();

    // Update the progress bar based on elapsed and total seconds
    function updateProgress(elapsedSeconds, totalSeconds) {
      const percent = totalSeconds === 0 
          ? 0 
          : Math.min(100, Math.round((elapsedSeconds / totalSeconds) * 100));

      progressFill.style.width = percent + "%";
      progressText.textContent = percent + "%";

      // Pulse only during progress
      if (percent > 0 && percent < 100) {
          progressFill.classList.add("active-progress");
      } else {
          progressFill.classList.remove("active-progress");
      }
    }

    // Start a countdown timer for the duration of the search
    function startTimer(totalSeconds) {
        let remaining = totalSeconds;

        // Initial display
        timerDisplay.textContent = `${remaining} seconds remaining`;
        timerDisplay.classList.remove('hidden');

        // Reset progress bar at the start
        updateProgress(0, totalSeconds);

        intervalId = setInterval(() => {

            remaining--;

            // Countdown display
            if (remaining >= 0) {
                timerDisplay.textContent = `${remaining} seconds remaining`;
            }

            // Update progress bar smoothly using elapsed time
            const elapsed = totalSeconds - remaining;
            updateProgress(elapsed, totalSeconds);

            // When timer finishes
            if (remaining < 0) {
                clearInterval(intervalId);
                timerDisplay.classList.add('hidden');

                // Lock progress at 100%
                updateProgress(totalSeconds, totalSeconds);
            }

        }, 1000);
    }


    // Stop the search loop and hide the timer
    stopButton.addEventListener('click', () => {
      stopLoop = true;
      clearInterval(intervalId);

      updateProgress(0, 100);  // resets the bar

      timerDisplay.classList.add('hidden');
      stopButton.classList.add('hidden');
      btnSearch.classList.remove('hidden');
    });

    // Handle form submission to start searches
    document.getElementById('searchForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      stopLoop = false;
      const num = numInput.value;
      totalDisplay.textContent = num;
      startTimer(Math.ceil(num * ((delay + 2000) / 1000 + 1)));
      await sleep(1000);
      performRandomSearches(num);
    });

    // Perform the specified number of random searches
    async function performRandomSearches(num) {
      stopButton.classList.remove('hidden');
      btnSearch.classList.add('hidden');
      for (let i = 0; i < num && !stopLoop; i++) {
        countDisplay.textContent = i + 1;
        const randomWord = await getRandomWord();
        const searchUrl = "https://www.bing.com/search?q=" + randomWord + "&cvid=f8f3a7a7e3d24d01985f89c0333f4a1b&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQLhhAMgYIAhAAGEAyBggDEAAYQDIGCAQQABhAMgYIBRAAGEAyBggGEAAYQDIGCAcQABhAMgYICBAAGEDSAQkxMDE3MGowajGoAgCwAgA&FORM=ANNTA1&adppc=EDGEESS&PC=U531";
        const win = window.open(searchUrl, '_blank');

        await sleep(delay);
        win.close();
        await sleep(2000);
      }
      stopButton.classList.add('hidden');
      btnSearch.classList.remove('hidden');
    }

    // Fetch a random word from a JSON file
    async function getRandomWord() {
      try {
        // Array of chunked file names
        const chunks = ['words1.json', 'words2.json', 'words3.json', 'words4.json', 'words5.json', 'words6.json', 'words7.json', 'words8.json', 'words9.json']; // Add more as needed
        // Select a random chunk
        const randomChunk = chunks[Math.floor(Math.random() * chunks.length)];

        console.log(`Fetching: ${randomChunk}`); // Log the chosen chunk

        const response = await fetch(randomChunk);
        if (!response.ok) {
          throw new Error(`Failed to load ${randomChunk}: ${response.statusText}`);
        }

        const data = await response.json();
        const words = Object.keys(data); // Extract the keys (words) from the JSON object
        const randomIndex = Math.floor(Math.random() * words.length); // Get a random index
        const randomWord = words[randomIndex]; // Get the word at the random index
        return randomWord;
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
