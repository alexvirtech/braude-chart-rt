const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        x: {
            axis: {
                color: "#9AA5A9"
            },
            ticks: {
                color: "#9AA5A9",
                font: {
                    size: 10,
                }
            },
            grid: {
                display: false,
                color: "#9AA5A9",
                borderColor: "#9AA5A9"
            }
        },
        y: {
            axis: {
                color: "#9AA5A9"
            },
            ticks: {
                color: "#9AA5A9",
                font: {
                    size: 10,
                }
            },
            grid: {
                color: "#9AA5A9",
                borderColor: "#9AA5A9",
                borderDash: [3, 3]
            }
        }
    }
}