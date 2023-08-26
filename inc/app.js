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

angular.module('chartApp', [])
    .controller('chartCtrl', function ($scope) {
        $scope.maxPoints = 60
        $scope.currentPoints = 0

        $scope.formatTime = function (timestamp) {
            const date = new Date(timestamp)
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const seconds = String(date.getSeconds()).padStart(2, '0')
            return `${hours}:${minutes}:${seconds}`
        }

        const initTime = new Date().getTime()

        // Initialize labels based on the current time
        $scope.labels = Array.from({ length: $scope.maxPoints }, (_, i) => $scope.formatTime(initTime + i * 1000))
        $scope.datasets = [{
            label: 'Price',
            data: new Array($scope.maxPoints).fill(null)
        }]

        $scope.setChartData = function (symbol) {
            // Reset data and labels
            $scope.currentPoints = 0
            $scope.datasets[0].data.fill(null)
            $scope.selectedSymbol = symbol // update the selected symbol

            // Update chart
            $scope.chart.update()
        }

        $scope.changeSymbol = function () {
            $scope.setChartData($scope.selectedSymbol)
        }

        $scope.changeSymbol = function () {
            $scope.setChartData($scope.selectedSymbol)
        }

        const wsURL = 'wss://tickers.herokuapp.com'
        const socket = new WebSocket(wsURL)
        const listURL = "https://api.mtw-testnet.com/tickers/all"
        $scope.selectedSymbol = 'BTC'
        $scope.symbols = []

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data)
            const symbol = $scope.selectedSymbol

            // Make sure to update only if the incoming data matches the selected symbol
            if (data.hasOwnProperty(symbol)) {
                const price = parseFloat(data[symbol].p)

                // Shift the existing data and labels if currentPoints have reached maxPoints
                if ($scope.currentPoints >= $scope.maxPoints) {
                    $scope.datasets[0].data = $scope.datasets[0].data.slice(45).concat(new Array(45).fill(null))
                    $scope.currentPoints -= 45
                }

                // Replace the null value with the real price at the current point index
                $scope.datasets[0].data[$scope.currentPoints] = price

                // Increment the current point index
                $scope.currentPoints++

                // Update the chart
                $scope.chart.update()
                $scope.$apply()
            }
        }

        angular.element(document).ready(function () {
            fetch(listURL)
                .then(response => response.json())
                .then(data => {
                    $scope.symbols = Object.keys(data)
                    $scope.safeApply()
                })
            const ctx = document.getElementById('myChart').getContext('2d')
            $scope.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: $scope.labels,
                    datasets: $scope.datasets
                },
                options: chartOptions
            })
        })

        $scope.safeApply = function (fn) {
            var phase = this.$root.$$phase
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn()
                }
            } else {
                this.$apply(fn)
            }
        }

    })
