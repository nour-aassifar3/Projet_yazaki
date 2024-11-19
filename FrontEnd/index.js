document.addEventListener('DOMContentLoaded', function() {
    const homeSection = document.getElementById('home-section');
    const devicesSection = document.getElementById('devices-section');
    const dataVisualizationSection = document.getElementById('data-visualization-section');
    const homeLink = document.getElementById('home-link');
    const devicesLink = document.getElementById('devices-link');
    const dataVisualizationLink = document.getElementById('data-visualization-link');

    function showSection(sectionToShow) {
        homeSection.style.display = 'none';
        devicesSection.style.display = 'none';
        dataVisualizationSection.style.display = 'none';
        sectionToShow.style.display = 'block';
    }

    homeLink.addEventListener('click', function() {
        showSection(homeSection);
    });
    devicesLink.addEventListener('click', function() {
        showSection(devicesSection);
    });
    dataVisualizationLink.addEventListener('click', function() {
        showSection(dataVisualizationSection);
    });

    showSection(homeSection);
});

// Récupérer les appareils depuis l'API
const apiUrl = 'http://127.0.0.1:8000/api/devices';
function getDevices() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const deviceList = document.getElementById('device-list');
            deviceList.innerHTML = '';
            data.forEach(device => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = device.name;
                row.appendChild(nameCell);

                const lastActivityCell = document.createElement('td');
                if (device.status === 'on') {
                    const circle = document.createElement('span');
                    circle.style.display = 'inline-block';
                    circle.style.width = '20px';
                    circle.style.height = '20px';
                    circle.style.borderRadius = '50%';
                    circle.style.backgroundColor = 'green';  // En ligne
                    lastActivityCell.appendChild(circle);
                } else {
                    lastActivityCell.textContent = device.last_activity ? new Date(device.last_activity).toLocaleString() : 'N/A'; // Date d'activité si hors ligne
                }
                row.appendChild(lastActivityCell);

                const temperatureCell = document.createElement('td');
                temperatureCell.textContent = device.temperature ? `${device.temperature} °C` : 'N/A';  // Température de l'appareil
                row.appendChild(temperatureCell);

                const actionsCell = document.createElement('td');
                const actionButton = document.createElement('button');
                const icon = document.createElement('i');
                if (device.status === 'on') {
                    icon.classList.add('fas', 'fa-power-off');
                    icon.style.color = 'red';
                } else {
                    icon.classList.add('fas', 'fa-power-off');
                    icon.style.color = 'green';
                }
                icon.style.fontSize = '22px';
                icon.style.backgroundColor = 'white';
                icon.style.cursor = 'pointer';

                actionButton.appendChild(icon);
                actionButton.style.border = 'none';
                actionButton.addEventListener('click', function() {
                    toggleDeviceStatus(device.id, device.status);
                });
                actionsCell.appendChild(actionButton);
                row.appendChild(actionsCell);
                deviceList.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des appareils :', error);
        });
}

function toggleDeviceStatus(deviceId, currentStatus) {
    const newStatus = currentStatus === 'on' ? 'off' : 'on';
    fetch(`http://127.0.0.1:8000/api/devices/${deviceId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Statut mis à jour avec succès:', data);
        getDevices();
    })
    .catch(error => {
        console.error('Erreur lors de la mise à jour du statut:', error);
    });
}

document.addEventListener('DOMContentLoaded', getDevices);

let temperatureChart, uptimeChart, deviceStatusChart;

document.addEventListener('DOMContentLoaded', function () {
    setupCharts();
    setInterval(fetchAndUpdateCharts, 5000); // Mise à jour des graphiques toutes les 5 secondes
});

function setupCharts() {
    const ctxTemp = document.getElementById('temperatureChart').getContext('2d');
    temperatureChart = new Chart(ctxTemp, {
        type: 'line',
        data: {
            labels: [], // Horaires
            datasets: [{
                label: 'Température (°C)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Horaires' } },
                y: { title: { display: true, text: 'Température (°C)' }, beginAtZero: true }
            }
        }
    });

    const ctxUptime = document.getElementById('uptimeChart').getContext('2d');
    uptimeChart = new Chart(ctxUptime, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Temps de disponibilité (minutes)',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Appareils' } },
                y: { title: { display: true, text: 'Temps de disponibilité (minutes)' }, beginAtZero: true }
            }
        }
    });

    // Graphique des statuts des appareils
    const ctxStatus = document.getElementById('deviceStatusChart').getContext('2d');
    deviceStatusChart = new Chart(ctxStatus, {
        type: 'pie',
        data: {
            labels: ['On', 'Off'],
            datasets: [{
                data: [0, 0],  // Initialement 0 appareils en "On" et 0 en "Off"
                backgroundColor: ['#28a745', '#dc3545'],
                borderColor: ['#28a745', '#dc3545'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw;
                        }
                    }
                }
            }
        }
    });
}
function fetchAndUpdateCharts() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const timestamps = data.map(device => new Date(device.last_activity).toLocaleTimeString());
            const temperatures = data.map(device => device.temperature || 0);

            temperatureChart.data.labels = timestamps;
            temperatureChart.data.datasets[0].data = temperatures;
            temperatureChart.update();

            const deviceNames = data.map(device => device.name);
            const uptimes = data.map(device => {
                if (device.status === 'on') {
                    const lastActivity = new Date(device.last_activity);
                    return Math.floor((Date.now() - lastActivity.getTime()) / 60000); // Convertir en minutes
                }
                return 0;
            });
            uptimeChart.data.labels = deviceNames;
            uptimeChart.data.datasets[0].data = uptimes;
            uptimeChart.update();
            const deviceStatus = data.reduce((statusCount, device) => {
                if (device.status === 'on') {
                    statusCount.on += 1;
                } else {
                    statusCount.off += 1;
                }
                return statusCount;
            }, { on: 0, off: 0 });
            deviceStatusChart.data.datasets[0].data = [deviceStatus.on, deviceStatus.off];
            deviceStatusChart.update();
        })
    .catch(error => console.error('Erreur lors de la mise à jour des graphiques :', error));
}


