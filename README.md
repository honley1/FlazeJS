# Flaze

Flaze - это API для создания и управления статьями с поддержкой изображений и HTML-тегов.

## Технологии

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **File Storage:** Local filesystem
- **Logging:** Winston

## Установка

1. Клонируйте репозиторий:

   ```bash
   git clone https://github.com/yourusername/FlazeJS.git
   cd FlazeJS
   ```

2. Установите зависимости:

   ```bash
   yarn install 
   ```

3. Создайте файл `.env` в корне проекта и добавьте следующие переменные окружения:

   ```plaintext
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/flaze
   SECRET_KEY=your_secret_key
   API_URL=http://localhost:5000
   ```

4. Запустите MongoDB (если не запущен):

   ```bash
   mongod
   ```

5. Запустите сервер:

   ```bash
   yarn start
   ```

## API эндпоинты

### Пользователи

- **Регистрация:**
  - `POST /api/v1/user/sign-up`
  - Тело запроса: `username`, `email`, `password`, `birthDate`, `bio`, `avatar (optional)`

- **Авторизация:**
  - `POST /api/v1/user/sign-in`
  - Тело запроса: `email`, `password`

- **Активация аккаунта:**
  - `GET /api/v1/user/activate/:link`

- **Получение пользователя по username:**
  - `GET /api/v1/user/:username`

- **Получение всех пользователей:**
  - `GET /api/v1/user/all`

### Статьи

- **Создание статьи:**
  - `POST /api/v1/article/`
  - Тело запроса: `title`, `content`, `tags`, `images (optional)`

- **Получение статьи по title:**
  - `GET /api/v1/article/:title`

- **Получение всех статей:**
  - `GET /api/v1/article/all`

- **Обновление статьи:**
  - `PUT /api/v1/article/:title`
  - Тело запроса: `title`, `content`, `tags`, `images (optional)`

- **Удаление статьи:**
  - `DELETE /api/v1/article/:title`

## Работа с изображениями

- Изображения, загруженные пользователями для статей, хранятся на сервере в директории `static/images/`.
- При загрузке изображений они автоматически сохраняются с уникальным именем для предотвращения конфликтов.
- В статьях хранятся ссылки на изображения, которые могут быть использованы в HTML-контенте.

## Логирование

Flaze использует библиотеку Winston для логирования ошибок и информации. Логи записываются в консоль и могут быть легко настроены для записи в файл или другие источники.

## Разработка

Для запуска сервера в режиме разработки с автоматической перезагрузкой используйте команду:

```bash
npm run dev
```

## Тестирование

- Напишите тесты для вашего API с использованием Jest или Mocha.
- Для запуска тестов используйте команду:

  ```bash
  yarn dev
  ```

## Лицензия

Этот проект лицензирован на условиях лицензии MIT. Подробности см. в файле `LICENSE`.
```