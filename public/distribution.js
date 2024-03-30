// scatterplot.js

// Function to fetch data and create scatter plot
function createScatterPlot() {
    // Fetch data from the server
    fetch('https://my-postgres-server.vercel.app/scores')
        .then(response => response.json())
        .then(serverData => {
            // Extract information for all test takers
            const names = serverData.map(entry => entry.name);
            const scores = serverData.map(entry => entry.score);

            // Extract the last test taker's information
            const lastTestTakerIndex = scores.length - 1;
            const lastTestTakerName = names[lastTestTakerIndex];
            const lastTestTakerScore = scores[lastTestTakerIndex];

            // Create scatter plot trace for all test takers
            const scatterTrace = {
                x: names,
                y: scores,
                mode: 'markers',
                type: 'scatter',
                name: 'Test Taker Scores',
                text: names.map((name, index) => `Name: ${name}<br>Score: ${scores[index]}`), // Display name and score on hover
                hoverinfo: 'text'
            };

            // Highlight the last test taker's score with a different marker color
            scatterTrace.marker = {
                color: scores.map((score, index) => (index === lastTestTakerIndex ? 'red' : 'blue')), // Set marker color based on test taker index
                size: 8 // Adjust size as needed
            };

            // Create a shape annotation for the red dashed line
            const annotation = {
                x: [lastTestTakerName],
                y: [lastTestTakerScore],
                xref: 'x',
                yref: 'y',
                xshift: -30, // Adjust the position of the annotation along the x-axis
                yshift: 0, // Adjust the position of the annotation along the y-axis
                text: '',
                showarrow: true,
                arrowhead: 2,
                arrowcolor: 'red',
                arrowsize: 2,
                arrowwidth: 2,
                arrowhead: 4,
                ax: 0,
                ay: -40, // Adjust the position of the arrow tip
                bordercolor: 'red',
                borderwidth: 2,
                borderpad: 4,
                bgcolor: 'white',
                opacity: 1,
                font: {
                    family: 'Arial',
                    size: 12,
                    color: 'red'
                }
            };

            // Layout configuration
            const layout = {
                title: 'Test Taker Scores',
                xaxis: {
                    title: 'Name'
                },
                yaxis: {
                    title: 'Score'
                },
                annotations: [annotation] // Add the shape annotation to the plot
            };

            // Plot the scatter plot trace
            Plotly.newPlot('plot', [scatterTrace], layout);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Call the function to create the scatter plot when the page loads
document.addEventListener('DOMContentLoaded', createScatterPlot);
