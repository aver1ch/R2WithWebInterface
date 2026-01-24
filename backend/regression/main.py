import argparse
import json
import os
import sys

from regression_service import Regression

def main():
    parser = argparse.ArgumentParser(description='Run regression analysis')
    parser.add_argument('--target_r2', type=float, default=0.8, help='Target R2 score')
    parser.add_argument('--input', required=True, help='Path to input CSV file')
    parser.add_argument('--output', required=True, help='Path to output directory')
    
    args = parser.parse_args()
    
    try:
        # Check if input file exists
        if not os.path.exists(args.input):
            error_result = {"success": False, "error": f"Input file {args.input} not found"}
            print(json.dumps(error_result))
            sys.exit(1)
        
        # Create output directory
        os.makedirs(args.output, exist_ok=True)
        
        service = Regression(target_r2=args.target_r2)
        
        with open(args.input, 'rb') as f:
            csv_content = f.read()
            
        result = service.analyze(csv_content)
        
        # Save CSV result
        csv_path = os.path.join(args.output, 'regression_results.csv')
        with open(csv_path, 'w', encoding='utf-8') as f:
            csv_data = result.get('coefficients_csv', '')
            if csv_data:
                f.write(csv_data)
        
        # Save image
        image_path = os.path.join(args.output, 'regression_plot.png')
        if result.get('plot_base64'):
            import base64
            with open(image_path, 'wb') as f:
                f.write(base64.b64decode(result['plot_base64']))
        
        result['csv_path'] = csv_path
        result['image_path'] = image_path
        
        # Print result as JSON to stdout
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {"success": False, "error": str(e)}
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()
