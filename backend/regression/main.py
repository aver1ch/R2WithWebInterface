#!/usr/bin/env python3
import sys
import base64
from regression_service import Regression


def main():
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
    except:
        sys.exit(1)
    
    try:
        service = Regression(target_r2=target_r2)
        results = service.analyze(csv_data)
    except:
        sys.exit(1)
    
    if not results['success']:
        sys.exit(1)
    
    # Сохраняем график
    try:
        with open('regression_plot.png', 'wb') as f:
            f.write(base64.b64decode(results['plot_base64']))
    except:
        sys.exit(1)
    
    # Сохраняем коэффициенты
    try:
        with open('regression_coefficients.csv', 'w', encoding='utf-8') as f:
            f.write(results['coefficients_csv'])
    except:
        sys.exit(1)


if __name__ == "__main__":
    main()