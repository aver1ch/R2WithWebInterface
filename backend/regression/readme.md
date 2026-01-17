
Класс `Regression` выполняет множественную линейную регрессию. 
Первый столбец CSV - целевая переменная, остальные - признаки.

```python
from regression_service import Regression

# 1. Инициализация
service = Regression(target_r2=0.85)  # target_r2(R²), которое задает пользователь

# Файл, который загружает пользователь
with open('data.csv', 'rb') as f:
    csv_data = f.read()

results = service.analyze(csv_data)

# 3. Результаты
if results['success']:
    print(f"R²: {results['r2_score']:.4f}")
    print(f"Уравнение: {results['equation']}")
    print(f"Коэффициенты: {results['coefficients']}")

    # График в base64
    plot_base64 = results['plot_base64']
    # Используйте на фронтенде: <img src="data:image/png;base64,{plot_base64}">

    # Либо если захотите график файлом сохранить
    import base64
    with open('regression_plot.png', 'wb') as f:
        f.write(base64.b64decode(results['plot_base64']))

    # Файл с коэфами
    with open('coefficients.csv', 'w', encoding='utf-8') as f:
        f.write(results['coefficients_csv'])