document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const messageDiv = document.getElementById('message');

    if (!file) {
        messageDiv.textContent = 'Пожалуйста, выберите файл.';
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        messageDiv.textContent = 'Файл успешно загружен на локальный диск.';
    } else {
        messageDiv.textContent = 'Ошибка при загрузке файла.';
    }
});
