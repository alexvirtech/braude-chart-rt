angular.module('chartApp', [])
    .controller('chartCtrl', function ($scope) {
        $scope.maxPoints = 60
        $scope.symbolData = {}
        $scope.labels = []
        $scope.datasets = [{
            label: 'Price',
            data: []

        }]

        const wsURL = 'wss://tickers.herokuapp.com'
        const socket = new WebSocket(wsURL)
        const listURL = "https://api.mtw-testnet.com/tickers/all"
        $scope.selectedSymbol = 'BTC'
        $scope.symbols = []

        angular.element(document).ready(function () {
            fetch(listURL)
                .then(response => response.json())
                .then(data => {
                    $scope.symbols = Object.keys(data)

                    socket.onmessage = (e) => {
                        $scope.createPoint(e.data)
                    }
                    $scope.safeApply()
                })
        })

        $scope.setChartData = function (symbol) {
            // Get the data associated with the selected symbol
            const selectedData = $scope.symbolData[symbol]

            if (selectedData) {
                // Completely replace the labels and data arrays with the new values
                $scope.labels.length = 0
                $scope.datasets[0].data.length = 0
                Array.prototype.push.apply($scope.labels, selectedData.labels.slice(-$scope.maxPoints))
                Array.prototype.push.apply($scope.datasets[0].data, selectedData.data.slice(-$scope.maxPoints))
                $scope.chart.update() // Refresh the chart
            }
        }

        $scope.changeSymbol = function () {
            //const selectedData = $scope.symbolData[$scope.selectedSymbol]
            $scope.setChartData($scope.selectedSymbol)
        }

        $scope.createPoint = function (d) {
            const data = JSON.parse(d)
            const symbol = $scope.selectedSymbol
            const timestamp = data[symbol].t
            const price = parseFloat(data[symbol].p)

            // Create the symbol data entry if it doesn't exist
            if (!$scope.symbolData[symbol]) {
                $scope.symbolData[symbol] = { labels: [], data: [] }
            }

            const selectedData = $scope.symbolData[symbol]

            // Add the new point
            selectedData.labels.push($scope.formatTime(timestamp))
            selectedData.data.push(price)

            // Trim to maxPoints
            if (selectedData.labels.length > $scope.maxPoints) {
                selectedData.labels.shift()
                selectedData.data.shift()
            }

            // Now update the chart data based on the selected symbol
            $scope.setChartData(symbol)
        }

        $scope.formatTime = function (timestamp) {
            const date = new Date(timestamp)
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const seconds = String(date.getSeconds()).padStart(2, '0')
            return `${hours}:${minutes}:${seconds}`
        }


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

        const ctx = document.getElementById('myChart').getContext('2d')
        $scope.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: $scope.labels,
                datasets: $scope.datasets
            },
            options: {
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
        })
    })


