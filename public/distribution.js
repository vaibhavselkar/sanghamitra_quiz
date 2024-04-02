// We can add this visualization on last page.
// visualization.js

// Function to fetch data and create visualization
function createVisualization() {
    // Fetch data from the server
    fetch('https://my-postgres-server.vercel.app/scores')
        .then(response => response.json())
        .then(userData => {
            // Extract scores and names
            const scores = userData.map(entry => entry.score);
            const names = userData.map(entry => entry.name);

            // Create data trace for the histogram
            const data = [{
                x: scores,
                type: 'histogram',
                name: 'Score Distribution'
            }];

            // Calculate the bin width for the histogram
            const binWidth = Math.round((Math.max(...scores) - Math.min(...scores)) / 10);

            // Calculate the bin where the last user's score lies
            const lastUserIndex = scores.length - 1;
            const lastUserScore = scores[lastUserIndex];
            const lastUserBin = Math.floor((lastUserScore - Math.min(...scores)) / binWidth) * binWidth;

            // Create data trace for the vertical line representing the last user's score
            const lineData = [{
                x: [lastUserBin, lastUserBin],
                y: [0, 100], // Adjust y-axis range as needed
                mode: 'lines',
                type: 'scatter',
                name: 'Your Score',
                line: {
                    color: 'red',
                    width: 2
                }
            }];

            // Add text annotation with the name and score of the last user
            const annotation = {
                x: lastUserBin + 2, // Adjust x-coordinate of the annotation
                y: 50, // Adjust y-coordinate of the annotation
                text: `${names[lastUserIndex]} (${lastUserScore})`,
                showarrow: false,
                font: {
                    color: 'red',
                    size: 12
                }
            };

            // Layout configuration
            const layout = {
                title: 'Score Distribution and Your Score Highlighted',
                xaxis: {
                    title: 'Score'
                },
                yaxis: {
                    title: 'Frequency'
                },
                annotations: [annotation] // Add the text annotation to the plot
            };

            // Plot the histogram with the vertical line and text annotation
            Plotly.newPlot('visualization', [data[0], lineData[0]], layout);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Call the function to create the visualization when the page loads
document.addEventListener('DOMContentLoaded', createVisualization);
