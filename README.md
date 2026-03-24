# R2WithWebInterface

Веб-интерфейс для запуска регрессионного анализа по CSV с целевым R², историей запусков и визуализацией результата.

## Возможности
- Регистрация и логин (JWT).
- Загрузка CSV и запуск регрессии с заданным `target_r2`.
- Генерация CSV с коэффициентами и PNG-графика.
- История запусков пользователя.

## Стек
- Backend: Go + PostgreSQL.
- ML/регрессия: Python (numpy, pandas, scikit-learn, matplotlib).
- Frontend: React (Create React App).
- Контейнеризация: Docker/Docker Compose.

## Быстрый старт (Docker)
```bash
docker compose up --build
```

Сервисы и порты:
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`
- Postgres: `localhost:5432`

## Конфигурация
Backend переменные окружения:
- `DATABASE_URL` — строка подключения к Postgres.
- `JWT_SECRET` — секрет для подписи JWT.
- `PYTHON_BIN` — путь к Python (по умолчанию `python3`).

Frontend переменные окружения:
- `REACT_APP_API_URL` — базовый URL API (по умолчанию в compose: `http://localhost:8080`).

## Требования к CSV
- Минимум 2 колонки.
- Минимум 10 строк.
- Первая колонка — целевая переменная `y`.
- Остальные колонки — признаки.

## API
Все запросы, кроме регистрации и логина, требуют `Authorization: Bearer <token>`.

- `POST /register`  
  Тело: `{ "email": "...", "password": "..." }`

- `POST /login`  
  Тело: `{ "email": "...", "password": "..." }`

- `POST /run`  
  `multipart/form-data`:
  - `file`: CSV файл
  - `target_r2` (опционально, float, по умолчанию `0.8`)
  
  Ответ:
  - `r2_score`, `target_r2`, `target_achieved`
  - `csv_data` (коэффициенты CSV строкой)
  - `csv_path`, `image_path`

- `GET /run/csv?path=...` — скачать CSV результатов.
- `GET /run/image?path=...` — скачать PNG графика.
- `GET /history` — история запусков пользователя.

## Локальная разработка (без Docker)

### Backend
1. Поднять Postgres и задать переменные окружения.
2. Установить зависимости Python:
   ```bash
   pip install -r /Users/averichie/Desktop/R2WithWebInterface/backend/regression/requirements.txt
   ```
3. Запустить сервер:
   ```bash
   cd /Users/averichie/Desktop/R2WithWebInterface/backend
   go run ./cmd/server --port 8080
   ```

### Frontend
```bash
cd /Users/averichie/Desktop/R2WithWebInterface/frontend/web_interface
npm install
npm start
```

## Структура репозитория
- `backend/` — Go API + Python регрессия.
- `frontend/web_interface/` — React UI.
- `docker-compose.yml` — запуск всех сервисов.
