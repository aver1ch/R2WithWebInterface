import sys
import base64
from regression_service import Regression


if len(sys.argv) != 3:
    sys.exit(1)
    
csv_path = sys.argv[1]
    
try:
    target_r2 = float(sys.argv[2])
except ValueError:
    sys.exit(1)
    
try:
    with open(csv_path, 'rb') as f:
        csv_data = f.read()
except FileNotFoundError:
    sys.exit(1)
    
service = Regression(target_r2=target_r2)
results = service.analyze(csv_data)
    
if not results['success']:
    sys.exit(1)
    
# Сохраняем график
with open('regression_plot.png', 'wb') as f:
    f.write(base64.b64decode(results['plot_base64']))
    
# Сохраняем коэффициенты
with open('regression_coefficients.csv', 'w', encoding='utf-8') as f:
    f.write(results['coefficients_csv'])


