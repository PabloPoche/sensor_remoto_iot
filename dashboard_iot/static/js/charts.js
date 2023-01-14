// Define Temperatura chart axes
const chartData = {
    datasets: [
        {
        fill: false,
        label: 'Temperatura',
        yAxisID: 'value',
        borderColor: "Red", 
        pointBoarderColor: "Red",
        backgroundColor: 'rgba(255, 0, 0, 0.4)',
        pointHoverBackgroundColor: "Red",
        pointHoverBorderColor: "Red",
        spanGaps: true,
        }
    ]
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    
    legend: {
        display: true,
        labels: {
        fontColor: "Red",
        fontSize: 20
                }
            },
        annotation:{
            drawTime: "afterDraw",
            annotations:[{
                        type: "line",
                        mode: "horizontal",
                        scaleID: "value",
                        value: [],
                        borderWidth: 1,
                        borderDash: [10,5],
                        borderColor: "gray",
                        label: {
                                backgroundColor: "gray",
                                content: "Set point" ,
                                enabled: true,
                                position: "center"
                                }
                        }]
                    },
    scales: {
        yAxes: [{
        id: 'value',
        type: 'linear',
            scaleLabel: {
            labelString: "°C",
            fontColor: "Red",
            fontSize: 20,
            display: true,
                        },    
        ticks: {
            beginAtZero: true,
            steps: 8,
            stepValue: 36,
            max: 50
                },
        position: 'left',
                }]
            }
};

chartData.labels = TempTime;
chartData.datasets[0].data = TempData;

// Get the context of the canvas element we want to select
const ctx = document.getElementById('TempChart').getContext('2d');
const TempChart = new Chart(
ctx,
{
    type: 'line',
    data: chartData,
    options: chartOptions,
});


// Define Humedad chart axes
const chartData2 = {
    datasets: [
        {
        fill: false,
        label: 'Humedad',
        yAxisID: 'value',
        borderColor: "Green",
        pointBoarderColor: "Green",
        backgroundColor: 'rgba(0, 204, 0, 0.4)',
        pointHoverBackgroundColor: "Green",
        pointHoverBorderColor: "Green",
        spanGaps: true,
        }
    ]
};

const chartOptions2 = {
    legend: {
        display: true,
        labels: {
        fontColor: "Green",
        fontSize: 20
            }
            },
        annotation:{
            drawTime: "afterDraw",
            annotations:[{
                        type: "line",
                        mode: "horizontal",
                        scaleID: 'value',
                        value: [],
                        borderWidth: 1,
                        borderDash: [10,5],
                        borderColor: "gray",
                        label: {
                                backgroundColor: "gray",
                                content: "Set point" ,
                                enabled: true,
                                position: "center"
                                }
                        }]
                    },
    scales: {
        yAxes: [{
        id: 'value',
        type: 'linear',
        scaleLabel: {
            labelString: "%",
            fontColor: "Green",
            fontSize: 20,
            display: true,
                    },
        ticks: {
            beginAtZero: true,
            steps: 2,
            stepValue: 5,
            // min: 10,
            max: 80
                },
        position: 'left',
                }]
            }
};

chartData2.labels = HumeTime;
chartData2.datasets[0].data = HumeData;

// Get the context of the canvas element we want to select
const ctx2 = document.getElementById('HumeChart').getContext('2d');
const HumeChart = new Chart(
ctx2,
{
    type: 'line',
    data: chartData2,
    options: chartOptions2,
});


chartReady = true;