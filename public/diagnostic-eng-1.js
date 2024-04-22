document.addEventListener("DOMContentLoaded", function() {
    console.log('english_q1.js script loaded');

    const questionsContainer = document.getElementById('questionsContainer-english');
    const submitButton = document.getElementById('submitButton-english');
    const nameInput = document.getElementById('name-english');
    const timerDisplay = document.getElementById('timer-english'); // Timer display element
    let questions;
    let selectedOptions = new Array(50).fill(null); // Array to store selected options
    let name;
    let timerInterval;
    let timeElapsed = 0; // Variable to store the time elapsed in seconds

    // Function to fetch questions data
    function fetchQuestions() {
        console.log('Fetching questions...');
        fetch('https://my-postgres-server.vercel.app/diagnos-eng-1')
            .then(res => res.json())
            .then(data => {
                console.log('Questions fetched:', data);
                questions = data;
                displayQuestions();
                startTimer(); // Start the timer when questions are fetched
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    }

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
        timerInterval = setInterval(() => {
            timeElapsed++;
            displayTime(); // Update the timer display every second
        }, 1000);
    }

    // Function to display the timer
    function displayTime() {
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Function to stop the timer
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Function to display questions
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

    // Function to display review
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

    // Function to submit the form
    function submitForm(nameInput, score) {
        fetch('https://my-postgres-server.vercel.app/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameInput.value, // Get the value from the name input field
                score: score,
                subject: 'diagnostic-eng(5-7)', // Corrected assignment operator
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

    function toggleSubmitButton() {
        submitButton.disabled = !nameInput.value.trim(); // Disable if name input is empty or contains only whitespace
    }

    // Event listener for submit button
    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission
        stopTimer(); // Stop the timer when the quiz is submitted
        const score = calculateScore(); // Calculate the score
        displayReview(score); // Display review based on the score
        submitForm(nameInput, score); // Submit the form
        
        // Remove the submit button and display time
        submitButton.style.display = 'none';
        timerDisplay.style.display = 'none'; // Hide the timer after submission
    });

    // Initial setup: Fetch questions and start the timer
    fetchQuestions();

    nameInput.addEventListener('input', (event) => {
        name = event.target.value; // Update name variable when input changes
        toggleSubmitButton(); // Enable or disable submit button based on name input
    });

    // Initial state: Disable submit button until name input is filled
    toggleSubmitButton();

    // Start the timer as soon as the page is loaded
    startTimer();
});
