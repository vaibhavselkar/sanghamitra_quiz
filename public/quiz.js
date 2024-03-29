document.addEventListener("DOMContentLoaded", function() {
    console.log('Quiz1.js script loaded');

    const nameInput = document.getElementById('name');
    const submitButton = document.getElementById('submitButton');
    let questions;
    let selectedOptions = new Array(50).fill(null); // Array to store selected options

    // Function to fetch questions data
    function fetchQuestions() {
        fetch('https://my-postgres-server.vercel.app/quiz1')
            .then(res => res.json())
            .then(data => {
                questions = data;
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    }

    // Event listener for the "Submit" button
    submitButton.addEventListener('click', () => {
        const name = nameInput.value;
        const score = calculateScore();
        submitForm(name, score);
    });

    // Function to calculate score
    function calculateScore() {
        let score = 0;
        // For simplicity, assume all answers are correct
        score = questions.length;
        return score;
    }

    // Function to submit form with name and score
    function submitForm(name, score) {
        // Navigate to submission.html with name and score as query parameters
        window.location.href = `submission.html?name=${name}&score=${score}`;
    }

    // Initial setup: Fetch questions
    fetchQuestions();
});
