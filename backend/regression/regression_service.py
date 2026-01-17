import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
import io
import base64
from typing import Dict, Union, Optional


class Regression:
    """
    решение задачи регрессии.
    """
    def __init__(self, target_r2: float = 0.8):
        if not 0 <= target_r2 <= 1:
            raise ValueError("R² должен быть от 0 до 1")
        
        self.target_r2 = target_r2
        self.model: Optional[LinearRegression] = None
        self.feature_names: Optional[list] = None
        self.r2_value: float = 0.0
        self.equation: str = ""
    
    def analyze(self, csv_content: Union[str, bytes]) -> Dict:
        try:
            df = self._read_csv(csv_content)
            
            if len(df.columns) < 2:
                return {"success": False, "error": "CSV должен содержать минимум 2 столбца"}
            
            if len(df) < 10:
                return {"success": False, "error": "Недостаточно данных (минимум 10 строк)"}
            
            y = df.iloc[:, 0].values.reshape(-1, 1)
            X = df.iloc[:, 1:].values
            self.feature_names = list(df.columns[1:])
            
            self._train_model(X, y)
            
            return {
                "success": True,
                "r2_score": self.r2_value,
                "target_achieved": self.r2_value >= self.target_r2,
                "equation": self.equation,
                "coefficients": self._get_coefficients(),
                "plot_base64": self._create_plot(X, y),
                "coefficients_csv": self._get_coefficients_csv()
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _read_csv(self, content: Union[str, bytes]) -> pd.DataFrame:
        return pd.read_csv(io.StringIO(content.decode() if isinstance(content, bytes) else content))
    
    def _train_model(self, X: np.ndarray, y: np.ndarray) -> None:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.3, random_state=42
        )
        
        self.model = LinearRegression()
        self.model.fit(X_train, y_train.ravel())
        
        y_pred = self.model.predict(X_test)
        self.r2_value = r2_score(y_test, y_pred)
        
        self._build_equation()
    
    def _build_equation(self) -> None:
        """Построение уравнения(если захотим его выводить)"""
        if self.model is None or self.feature_names is None:
            return
    
        intercept = float(self.model.intercept_)
        parts = [f"y = {intercept:.4f}"]
    
        for coef, feature in zip(self.model.coef_, self.feature_names):
            parts.append(f" + {float(coef):.4f}·{feature}")
    
        self.equation = "".join(parts)
    
    def _get_coefficients(self) -> Dict[str, float]:
        if self.model is None:
            return {}
        
        intercept = self.model.intercept_
        if hasattr(intercept, '__len__'):
            intercept = intercept[0]
        
        coefficients = self.model.coef_
        
        coeff_dict = {"intercept": float(intercept)}
        for feature, coef in zip(self.feature_names, coefficients):
            coeff_dict[feature] = float(coef)
        
        return coeff_dict
    
    def _get_coefficients_csv(self) -> str:
        coeff_dict = self._get_coefficients()
        
        df = pd.DataFrame({
            'parameter': list(coeff_dict.keys()),
            'coefficient': list(coeff_dict.values())
        })
        
        return df.to_csv(index=False)
    
    def _create_plot(self, X: np.ndarray, y: np.ndarray) -> str:
        _, X_test, _, y_test = train_test_split(
            X, y, test_size=0.3, random_state=42
        )
        
        y_pred = self.model.predict(X_test)
        
        plt.figure(figsize=(10, 6))
        plt.scatter(y_test, y_pred, alpha=0.7, s=50, color='blue')
        plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_pred.max()], 
                'r--', linewidth=2)
        
        plt.xlabel('Фактические значения')
        plt.ylabel('Предсказанные значения')
        
        plt.title(f'R² = {self.r2_value:.4f}')
        
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=150, bbox_inches='tight')
        plt.close()
        
        buffer.seek(0)
        return base64.b64encode(buffer.read()).decode('utf-8')