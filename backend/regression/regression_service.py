import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
from sklearn.preprocessing import PolynomialFeatures
import io
import base64
from typing import Dict, Union, Optional


class Regression:
    
    def __init__(self, target_r2: float = 0.8):
        if not 0 <= target_r2 <= 1:
            raise ValueError("R² должен быть в диапазоне [0, 1]")
        
        self.target_r2 = target_r2
        self.model: Optional[LinearRegression] = None
        self.feature_names: Optional[list] = None
        self.poly_features: Optional[PolynomialFeatures] = None
        self.r2_value: float = 0.0
        self.equation: str = ""
        self.best_degree: int = 1
    
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
            
            self._train_best_model(X, y)
            
            return {
                "success": True,
                "r2_score": self.r2_value,
                "target_achieved": self.r2_value >= self.target_r2,
                "equation": self.equation,
                "coefficients": self._get_coefficients(),
                "plot_base64": self._create_plot(X, y),
                "coefficients_csv": self._get_coefficients_csv(),
                "degree_used": self.best_degree
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _read_csv(self, content: Union[str, bytes]) -> pd.DataFrame:
        return pd.read_csv(io.StringIO(content.decode() if isinstance(content, bytes) else content))
    
    def _train_best_model(self, X: np.ndarray, y: np.ndarray) -> None:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.3, random_state=42
        )
        
        best_score = -float('inf')
        best_degree = 1
        
        for degree in range(1, 4):
            if degree == 1:
                X_train_poly = X_train
                X_test_poly = X_test
                n_features = X_train.shape[1]
            else:
                poly = PolynomialFeatures(degree=degree, include_bias=False)
                X_train_poly = poly.fit_transform(X_train)
                X_test_poly = poly.transform(X_test)
                n_features = X_train_poly.shape[1]
            
            # Пропускаем если слишком много признаков
            if n_features > 50:
                continue
            
            model = LinearRegression()
            model.fit(X_train_poly, y_train.ravel())
            
            y_pred = model.predict(X_test_poly)
            r2 = r2_score(y_test, y_pred)
            
            # Штраф за сложность
            penalty = 0.0
            if degree > 1:
                # Штраф 0.02 за каждый дополнительный параметр относительно degree=1
                base_params = X_train.shape[1] + 1
                current_params = n_features + 1
                penalty = 0.02 * (current_params - base_params) / base_params
            
            # Штраф за использование более высокой степени
            if degree > best_degree:
                degree_penalty = 0.02 * (degree - best_degree)
                penalty += degree_penalty
            
            adjusted_score = r2 - penalty
            
            if adjusted_score > best_score:
                best_score = adjusted_score
                best_degree = degree
                self.model = model
                self.r2_value = r2
                
                if degree > 1:
                    self.poly_features = poly
                else:
                    self.poly_features = None
        
        self.best_degree = best_degree
        self._build_equation()
    
    def _build_equation(self) -> None:
        if self.model is None or self.feature_names is None:
            return
        
        intercept = float(self.model.intercept_)
        
        if self.best_degree == 1:
            coefficients = self.model.coef_
            parts = [f"y = {intercept:.4f}"]
            
            for coef, feature in zip(coefficients, self.feature_names):
                if abs(coef) > 1e-10:
                    sign = " + " if coef >= 0 else " - "
                    parts.append(f"{sign}{abs(coef):.4f}·{feature}")
        else:
            if self.poly_features is None:
                return
            
            powers = self.poly_features.powers_
            coefficients = self.model.coef_
            parts = [f"y = {intercept:.4f}"]
            
            # Собираем только значимые члены
            significant_terms = []
            for coef, power in zip(coefficients, powers):
                if abs(coef) > 1e-10:
                    term_parts = []
                    for i, p in enumerate(power):
                        if p > 0:
                            if p == 1:
                                term_parts.append(self.feature_names[i])
                            else:
                                term_parts.append(f"{self.feature_names[i]}^{p}")
                    
                    if term_parts:
                        term = "·".join(term_parts)
                        significant_terms.append((coef, term))
            
            # Сортируем по убыванию абсолютного значения коэффициента
            significant_terms.sort(key=lambda x: abs(x[0]), reverse=True)
            
            for coef, term in significant_terms:
                sign = " + " if coef >= 0 else " - "
                parts.append(f"{sign}{abs(coef):.4f}·{term}")
        
        self.equation = "".join(parts)
    
    def _get_coefficients(self) -> Dict[str, float]:
        if self.model is None:
            return {}
        
        intercept = self.model.intercept_
        if hasattr(intercept, '__len__'):
            intercept = intercept[0]
        
        coefficients = self.model.coef_
        coeff_dict = {"intercept": float(intercept)}
        
        if self.best_degree == 1:
            for feature, coef in zip(self.feature_names, coefficients):
                coeff_dict[feature] = float(coef)
        else:
            if self.poly_features is not None:
                powers = self.poly_features.powers_
                for coef, power in zip(coefficients, powers):
                    if abs(coef) > 1e-10:
                        term_parts = []
                        for i, p in enumerate(power):
                            if p > 0:
                                if p == 1:
                                    term_parts.append(self.feature_names[i])
                                else:
                                    term_parts.append(f"{self.feature_names[i]}^{p}")
                        
                        if term_parts:
                            term = "·".join(term_parts)
                            coeff_dict[term] = float(coef)
        
        return coeff_dict
    
    def _get_coefficients_csv(self) -> str:
        coeff_dict = self._get_coefficients()
        
        df = pd.DataFrame({
            'parameter': list(coeff_dict.keys()),
            'coefficient': list(coeff_dict.values())
        })
        
        return df.to_csv(index=False)
    
    def _create_plot(self, X: np.ndarray, y: np.ndarray) -> str:
        if self.best_degree > 1 and self.poly_features is not None:
            X_transformed = self.poly_features.transform(X)
        else:
            X_transformed = X
        
        _, X_test, _, y_test = train_test_split(
            X_transformed, y, test_size=0.3, random_state=42
        )
        
        y_pred = self.model.predict(X_test)
        
        plt.figure(figsize=(10, 6))
        plt.scatter(y_test, y_pred, alpha=0.7, s=50, color='blue')
        
        min_val = min(y_test.min(), y_pred.min())
        max_val = max(y_test.max(), y_pred.max())
        plt.plot([min_val, max_val], [min_val, max_val], 'r--', linewidth=2)
        
        plt.xlabel('Фактические значения')
        plt.ylabel('Предсказанные значения')
        
        title = f'R² = {self.r2_value:.4f}'
        if self.best_degree > 1:
            title += f' (Степень {self.best_degree})'
        
        plt.title(title)
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=150, bbox_inches='tight')
        plt.close()
        
        buffer.seek(0)
        return base64.b64encode(buffer.read()).decode('utf-8')