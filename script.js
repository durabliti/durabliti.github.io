let socket;
let isConnected = false;

function connectWebSocket() {
    if (isConnected) {
        console.log("WebSocket уже подключен");
        return; // Если соединение уже установлено, не делаем ничего
    }

    // Используем публичный WebSocket сервер для тестов
    socket = new WebSocket('wss://echo.websocket.org');  // Публичный сервер WebSocket Echo

    socket.onopen = function() {
        isConnected = true;
        document.getElementById('status').innerText = 'Status: Connected';
        console.log('WebSocket подключен');
    };

    socket.onclose = function() {
        isConnected = false;
        document.getElementById('status').innerText = 'Status: Disconnected';
        console.log('WebSocket отключен');
    };

    socket.onerror = function(error) {
        document.getElementById('status').innerText = 'Status: Error';
        console.error('WebSocket ошибка:', error);
    };

    socket.onmessage = function(event) {
        console.log('Сообщение от сервера:', event.data);
        // Эхо-сервер возвращает то же сообщение обратно
        socket.send(event.data);  
    };
}

// Слушатель для кнопки
document.getElementById('startBtn').addEventListener('click', function() {
    if (!isConnected) {
        connectWebSocket(); // Подключаем WebSocket только если еще не подключено
    }
});

// Добавим небольшое ожидание, чтобы все элементы загружались перед подключением
window.onload = function() {
    console.log("Страница загружена, готова к подключению.");
};
