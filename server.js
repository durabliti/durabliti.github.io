const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Настройка хранения файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Папка для сохранения файлов
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Сохранение с оригинальным именем
    },
});

const upload = multer({ storage });

// Создание папки для загрузки, если ее нет
const fs = require('fs');
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// Обработка загрузки файла
app.post('/upload', upload.single('file'), (req, res) => {
    res.sendStatus(200);
});

// Отправка HTML страницы
app.use(express.static('.'));

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
