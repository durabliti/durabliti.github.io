let socket;
let isConnected = false;
let isScreenSharing = false;
let screenStream = null;

const videoElement = document.getElementById('videoElement');
const screenShareBtn = document.getElementById('screenShareBtn');
const startBtn = document.getElementById('startBtn');
const statusElement = document.getElementById('status');

// Функция для подключения WebSocket
function connectWebSocket() {
    if (isConnected) {
        console.log("WebSocket уже подключен");
        return; // Если соединение уже установлено, не делаем ничего
    }

    socket = new WebSocket('wss://echo.websocket.org'); // Публичный сервер WebSocket Echo

    socket.onopen = function() {
        isConnected = true;
        statusElement.innerText = 'Status: Connected';
        console.log('WebSocket подключен');
    };

    socket.onclose = function() {
        isConnected = false;
        statusElement.innerText = 'Status: Disconnected';
        console.log('WebSocket отключен');
    };

    socket.onerror = function(error) {
        statusElement.innerText = 'Status: Error';
        console.error('WebSocket ошибка:', error);
    };

    socket.onmessage = function(event) {
        console.log('Сообщение от сервера:', event.data);
        socket.send(event.data); // Эхо-сервер возвращает то же сообщение обратно
    };
}

// Функция для начала/остановки демонстрации экрана
async function toggleScreenShare() {
    if (isScreenSharing) {
        // Если демонстрация экрана уже идет, останавливаем поток
        if (screenStream) {
            let tracks = screenStream.getTracks();
            tracks.forEach(track => track.stop()); // Останавливаем все треки
        }
        videoElement.srcObject = null; // Очищаем видео элемент
        isScreenSharing = false;
        screenShareBtn.innerText = 'Start Screen Share';
    } else {
        // Начинаем демонстрацию экрана
        try {
            screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            videoElement.srcObject = screenStream; // Показываем экран на странице
            isScreenSharing = true;
            screenShareBtn.innerText = 'Stop Screen Share';
        } catch (error) {
            console.error('Ошибка при получении экрана:', error);
            alert('Ошибка при получении доступа к экрану.');
        }
    }
}

// Слушатели событий
startBtn.addEventListener('click', function() {
    if (!isConnected) {
        connectWebSocket(); // Подключаем WebSocket только если еще не подключено
    }
});

screenShareBtn.addEventListener('click', toggleScreenShare);

// Автоматически подключаем WebSocket при загрузке
window.onload = function() {
    console.log("Страница загружена, готова к подключению.");
};
