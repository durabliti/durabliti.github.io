function uploadFiles() {
    const input = document.getElementById('fileInput');
    const files = input.files;
    const fileList = document.getElementById('fileList');

    fileList.innerHTML = ''; // Очистить список файлов

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const listItem = document.createElement('div');
        listItem.textContent = file.name;

        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(file);
        downloadLink.download = file.name;
        downloadLink.textContent = 'Скачать';
        downloadLink.style.marginLeft = '10px';

        listItem.appendChild(downloadLink);
        fileList.appendChild(listItem);
    }
}
