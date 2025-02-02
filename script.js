let socket;
let isConnected = false;
let isCameraOn = false;
let isMicOn = false;
let videoStream = null;

const videoElement = document.getElementById('videoElement');
const cameraBtn = document.getElementById('cameraBtn');
const micBtn = document.getElementById('micBtn');
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

// Камера и микрофон
async function toggleCamera() {
    if (isCameraOn) {
        // Если камера уже включена, останавливаем ее
        if (videoStream) {
            let tracks = videoStream.getTracks();
            tracks.forEach(track => track.stop()); // Останавливаем все треки
        }
        videoElement.srcObject = null; // Очищаем видео элемент
        isCameraOn = false;
        cameraBtn.innerText = 'Enable Camera';
    } else {
        // Включаем камеру
        try {
            videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoElement.srcObject = videoStream; // Показываем видео на странице
            isCameraOn = true;
            cameraBtn.innerText = 'Disable Camera';
        } catch (error) {
            console.error('Ошибка при включении камеры:', error);
        }
    }
}

function toggleMic() {
    if (isMicOn) {
        if (videoStream) {
            let tracks = videoStream.getAudioTracks();
            tracks.forEach(track => track.stop()); // Останавливаем микрофон
        }
        isMicOn = false;
        micBtn.innerText = 'Enable Microphone';
    } else {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {
                // Получаем и добавляем аудио в видео стрим
                if (videoStream) {
                    let audioTrack = stream.getAudioTracks()[0];
                    videoStream.addTrack(audioTrack);
                } else {
                    videoStream = stream;
                }
                isMicOn = true;
                micBtn.innerText = 'Disable Microphone';
            })
            .catch(function(error) {
                console.error('Ошибка при включении микрофона:', error);
            });
    }
}

// Слушатели событий
startBtn.addEventListener('click', function() {
    if (!isConnected) {
        connectWebSocket(); // Подключаем WebSocket только если еще не подключено
    }
});

cameraBtn.addEventListener('click', toggleCamera);
micBtn.addEventListener('click', toggleMic);

// Автоматически подключаем WebSocket при загрузке
window.onload = function() {
    console.log("Страница загружена, готова к подключению.");
};
