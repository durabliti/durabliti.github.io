<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket Dynamic Enable</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f4f4f4;
        }
        #status {
            margin-top: 10px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>WebSocket Connection Example</h1>
    <button id="startBtn">Start WebSocket</button>
    <p id="status">Status: Not Connected</p>

    <script>
        let socket;

        function connectWebSocket() {
            // Проверяем, если WebSocket уже открыт, то не открываем его снова
            if (socket && socket.readyState === WebSocket.OPEN) {
                console.log("WebSocket уже открыт");
                return;
            }

            // Динамическое подключение WebSocket
            socket = new WebSocket('ws://example.com/socket');  // Укажи правильный URL WebSocket сервера

            socket.onopen = function() {
                document.getElementById('status').innerText = 'Status: Connected';
                console.log('WebSocket подключен');
            };

            socket.onclose = function() {
                document.getElementById('status').innerText = 'Status: Disconnected';
                console.log('WebSocket отключен');
            };

            socket.onerror = function(error) {
                document.getElementById('status').innerText = 'Status: Error';
                console.error('WebSocket ошибка:', error);
            };

            socket.onmessage = function(event) {
                console.log('Сообщение от сервера:', event.data);
            };
        }

        // Подключаемся автоматически, когда загружается страница
        connectWebSocket();

        // Слушатель события для кнопки
        document.getElementById('startBtn').addEventListener('click', connectWebSocket);
    </script>
</body>
</html>
