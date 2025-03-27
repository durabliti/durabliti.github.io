document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const messageDiv = document.getElementById('message');

    if (!file) {
        messageDiv.textContent = 'Пожалуйста, выберите файл.';
        return;
    }

    // Отображение информации о файле
    messageDiv.textContent = `Файл "${file.name}" успешно выбран. Размер: ${file.size} байт.`;
});
