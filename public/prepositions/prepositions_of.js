document.addEventListener("DOMContentLoaded", function() {
    console.log('preposition.js script loaded');

    const questionsContainer = document.getElementById('questionsContainer-prepo');
    const submitButton = document.getElementById('submitButton-prepo');
    const nameInput = document.getElementById('name-prepo');
    const timerDisplay = document.getElementById('timer-prepo'); // Timer display element
    let questions;
    let selectedOptions = new Array(50).fill(null); // Array to store selected options
    let name;
    let timerInterval;
    let timeElapsed = 0; // Variable to store the time elapsed in seconds

    // Function to fetch questions data
    function fetchQuestions() {
        console.log('Fetching questions...');
        fetch('https://my-postgres-server.vercel.app/prepo-of')
            .then(res => res.json())
            .then(data => {
                console.log('Questions fetched:', data);
                questions = data;
                displayQuestions();
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    }

    // Function to display the questions
    function displayQuestions() {
        console.log('Displaying questions...');
        console.log('Questions:', questions);
        questionsContainer.innerHTML = ''; // Clear previous questions

        questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerHTML = `
                <div>
                    <p>${index + 1}. ${question.question}</p>
                    <div class="options">
                        <button class="option" data-index="${index}" data-option="a">a. ${question.option_a}</button>
                        <button class="option" data-index="${index}" data-option="b">b. ${question.option_b}</button>
                        <button class="option" data-index="${index}" data-option="c">c. ${question.option_c}</button>
                        <button class="option" data-index="${index}" data-option="d">d. ${question.option_d}</button>
                    </div>
                </div>
            `;
            questionsContainer.appendChild(questionElement);
        });

        // Add event listeners to options
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', selectOption);
        });
    }

    // Function to select option for each question
    function selectOption(event) {
        const index = event.target.dataset.index;
        const option = event.target.dataset.option;
        selectedOptions[index] = option;
        document.querySelectorAll(`.option[data-index="${index}"]`).forEach(opt => {
            opt.classList.remove('selected');
        });
        event.target.classList.add('selected');
    }

    // Function to start the timer
    function startTimer() {
        startTime = Date.now(); // Record the start time
        timerInterval = setInterval(displayTime, 1000); // Update the timer display every second
    }
    
    // Function to display the timer
    function displayTime() {
        const currentTime = Date.now(); // Get the current time
        const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed time in seconds
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update the timeElapsed variable
        timeElapsed = elapsedTime;
    }

    // Function to stop the timer
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Function to enable or disable submit button based on name input
    function toggleSubmitButton() {
        submitButton.disabled = !nameInput.value.trim(); // Disable if name input is empty or contains only whitespace
    }

    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission
        stopTimer(); // Stop the timer when the quiz is submitted
        const score = calculateScore(); // Calculate the score
        displayReview(score); // Display review based on the score
        submitForm(nameInput, score); // Submit the form
        
        // Remove the submit button
        submitButton.style.display = 'none';
        
        // Add a new button for feedback
        const feedbackLink = document.createElement('a');
        feedbackLink.textContent = 'Click To Provide Feedback';
        feedbackLink.href = 'https://forms.gle/VmWRLfKCfR4MnnRp7'; // Add your feedback link here
        feedbackLink.classList.add('btn', 'btn-primary');
        feedbackLink.target = '_blank';
        submitButton.parentNode.appendChild(feedbackLink);

        // Add a button for statistics
        const statisticsButton = document.createElement('button');
        statisticsButton.textContent = 'View Statistics';
        statisticsButton.classList.add('btn', 'btn-primary', 'mx-2');
        statisticsButton.onclick = function() {
            window.location.href = '../submission.html'; // Replace 'statistics.html' with your actual statistics page URL
        };
        submitButton.parentNode.appendChild(statisticsButton);
        
        // Add a button for home page
        const homeButton = document.createElement('button');
        homeButton.textContent = 'Home';
        homeButton.classList.add('btn', 'btn-primary');
        homeButton.onclick = function() {
            window.location.href = '../english.html'; // Replace 'index.html' with your actual home page URL
        };
        submitButton.parentNode.appendChild(homeButton);

    });

    // Function to calculate score
    function calculateScore() {
        let score = 0;
        const totalQuestions = questions.length;
    
        for (let i = 0; i < totalQuestions; i++) {
            if (selectedOptions[i] === questions[i].correct_option) {
                score++;
            }
        }
    
        score = (score / totalQuestions) * 100; // Calculate the percentage
        return score; // Return the score as a percentage
    }

    // Function to display review based on the score
    function displayReview(score) {
        let reviewMessage = '';
        let scorePercentage = Math.round(score * 100) / 100; // Calculate score percentage
        if (score >= 70) {
            reviewMessage = `Congratulations! You Have Scored ${scorePercentage}%.`;
        } else {
            reviewMessage = `Congratulations! You Have Scored ${scorePercentage}%.`;
        }
    
        let reviewHTML = `
            <h1>${reviewMessage}</h1>
            <h2> Please review your answers below. Correct answers are highlighted in green, while incorrect answers are highlighted in red. </h2>
            <ul>
        `;
        questions.forEach((question, index) => {
            let selectedOption = selectedOptions[index];
            let correctOption = question.correct_option;
    
            reviewHTML += `<li>${index + 1}. ${question.question}<br>`;
            ['a', 'b', 'c', 'd'].forEach((option) => {
                if (selectedOption === option && selectedOption !== correctOption) {
                    // Incorrectly selected option
                    reviewHTML += `<span style="color: red;">${option}. ${question['option_' + option]}</span><br>`;
                } else if (selectedOption === option && selectedOption === correctOption) {
                    // Correctly selected option
                    reviewHTML += `<span style="color: green;">${option}. ${question['option_' + option]}</span><br>`;
                } else if (option === correctOption) {
                    // Correct option
                    reviewHTML += `<span style="color: green;">${option}. ${question['option_' + option]}</span><br>`;
                } else {
                    // Incorrect option (not selected)
                    reviewHTML += `${option}. ${question['option_' + option]}<br>`;
                }
            });
            reviewHTML += `</li><br>`;
        });
        reviewHTML += '</ul>';
    
        questionsContainer.innerHTML = reviewHTML;
    }
    
    function submitForm(nameInput, score) {
        fetch('https://my-postgres-server.vercel.app/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameInput.value, // Get the value from the name input field
                score: score,
                subject: 'Prepositions of, on, at, in', // Corrected assignment operator
                time_taken: timeElapsed // Add the time taken by the user
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Data saved successfully:', data);
            // Redirect or perform other actions if needed
        })
        .catch(error => {
            console.error('Error saving data:', error);
            // Handle errors
        });
    }

    // Event listener for name input
    nameInput.addEventListener('input', (event) => {
        name = event.target.value; // Update name variable when input changes
        toggleSubmitButton(); // Enable or disable submit button based on name input
    });

    // Initial setup: Fetch questions and start the timer
    fetchQuestions();
    startTimer(); // Start the timer as soon as the page is loaded

    // Initial state: Disable submit button until name input is filled
    toggleSubmitButton();
});