---
layout: default
title: ML Cheatsheet
parent: Machine Learning
nav_order: 2
---

# ML Cheat Sheet

Quick reference for machine learning: learning paradigms, algorithm
selection, metrics, bias/variance, and feature engineering.

## Core Concepts

- **Feature (x):** An input variable used for prediction.
- **Label (y):** The target output you are predicting.
- **Training set:** Data the model learns from.
- **Validation set:** Held-out data for tuning hyperparameters.
- **Test set:** Held-out data for final, unbiased evaluation.
- **Model:** Function f(x) mapping features to predictions.
- **Underfitting:** Too simple; high bias, poor on train and test.
- **Overfitting:** Too complex; memorizes noise, great train, poor test.

## Learning Paradigms

| Paradigm | Labeled Data | Goal | Example |
|----------|--------------|------|---------|
| Supervised | Yes | Predict label from features | Spam classification |
| Unsupervised | No | Discover structure | Customer clustering |
| Reinforcement | Rewards, no labels | Maximize cumulative reward | Game playing |
| Semi-supervised | A little + lots unlabeled | Use unlabeled to boost | Web pages with few tags |
| Self-supervised | Labels generated from data | Learn useful representations | BERT pretraining |

### Supervised subtasks

- **Classification:** Discrete labels (spam / not spam).
- **Regression:** Continuous values (house price).
- **Ranking:** Order items by relevance.

## Algorithm Selection Guide

| Task | Algorithm | When to Use | Pros | Cons |
|------|-----------|-------------|------|------|
| Regression | Linear Regression | Linear trends, baseline | Fast, interpretable | Poor with complex patterns |
| Regression | Ridge / Lasso | Correlated features | Shrinks coefficients | Needs scaling |
| Regression | Decision Tree | Non-linear, tabular | Interpretable, no scaling | Prone to overfit |
| Regression | Random Forest | Tabular with noise | Robust, feature importance | Slower to train, black box |
| Classification | Logistic Regression | Baseline, probabilities | Fast, calibrated output | Linear decision boundary |
| Classification | Decision Tree | Interpretability wanted | Clear rules | Overfits small data |
| Classification | SVM / RBF SVM | Small-mid, clean data | Strong margin, kernels | Slow on big data |
| Classification | k-NN | Simple, small data | No training, intuitive | Slow at inference, scaling |
| Classification | Random Forest | General tabular use | Handles non-linearity | Less interpretable |
| Classification | XGBoost | Competition, structured | State-of-the-art tabular | Needs tuning, memory |
| Clustering | k-Means | Spherical, convex clusters | Fast, scalable | Picks k, sensitive to scale |
| Clustering | DBSCAN | Arbitrary shapes, outliers | No k needed | Bad on varying density |
| Clustering | Hierarchical | Dendrogram wanted | No k, easy to view | O(n^2), not scalable |
| Dimensionality Reduction | PCA | Collinear, visualization | Linear, fast | Assumes linearity |
| Dimensionality Reduction | t-SNE / UMAP | Visualize high-D | Great clusters | Non-linear, no mapping |

### Simple decision flow

```
Labeled? No          -> clustering (k-means) or dim-reduction (PCA)
Reward-based?        -> reinforcement learning
Small, interpretable -> decision tree / logistic regression
Bigger, tabular      -> random forest / XGBoost / gradient boosting
Images/text          -> deep learning (see DL cheat sheet)
```

### Quick sklearn examples

```python
from sklearn.linear_model import LogisticRegression
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

```python
from sklearn.neighbors import KNeighborsClassifier

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)          # "lazy": stores training data
score = knn.score(X_test, y_test)  # distances computed at predict time
```

```python
from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=3, n_init=10, random_state=0)
labels = kmeans.fit_predict(X)     # assign each point to a cluster
centers = kmeans.cluster_centers_
```

```python
from sklearn.decomposition import PCA

pca = PCA(n_components=2)         # project to 2D for visualization
X_2d = pca.fit_transform(X)
print("explained variance:", pca.explained_variance_ratio_)
```

## Metrics Table

| Task | Metric | Formula / Idea | When It Matters |
|------|--------|----------------|-----------------|
| Classification | Accuracy | (TP+TN) / total | Balanced classes |
| Classification | Precision | TP / (TP+FP) | Minimize false positives |
| Classification | Recall | TP / (TP+FN) | Minimize false negatives |
| Classification | F1 | 2*P*R / (P+R) | Balanced P/R trade-off |
| Classification | AUC-ROC | Area under TPR/FPR curve | Threshold-independent quality |
| Classification | Log Loss | -sum y*log(p) | Calibrated probabilities |
| Regression | MSE | mean((y - yhat)^2) | Penalizes big errors |
| Regression | RMSE | sqrt(MSE) | Same units as y |
| Regression | MAE | mean(|y - yhat|) | Robust to outliers |
| Regression | R^2 | 1 - SSE/SST | Variance explained |
| Clustering | Silhouette | (b - a) / max(a,b) | Cluster separation |
| Clustering | Inertia | sum of squared distances | Choose k (elbow) |

### Confusion matrix anatomy

```
              Predicted
              Negative  Positive
Actual: Neg     TN        FP
        Pos     FN        TP

Precision = how many flagged positives are real
Recall    = how many real positives we caught
```

> **F1 note:** Use F1 when classes are unbalanced and you care about both
> precision and recall (e.g., fraud detection).

## Bias / Variance Trade-off

| Problem | Symptom | Fix |
|---------|---------|-----|
| High bias (underfit) | Poor train AND test | More features, stronger model, lower regularization |
| High variance (overfit) | Great train, poor test | More data, regularization, simpler model, ensembling |

```
         Underfit        Balanced        Overfit
train:    low              high             very high
test:     low              high             low
```

## Solutions for Overfitting

1. More training data (and/or augmentation).
2. Simpler model (fewer features, smaller tree depth).
3. Regularization: L1/L2, dropout (deep learning).
4. Early stopping during training.
5. Cross-validation to tune hyperparameters.
6. Ensemble methods (bagging, random forests) reduce variance.
7. Feature selection / dimensionality reduction.

## Data Splitting

| Split | Purpose | Typical Size |
|-------|---------|--------------|
| Train | Fit model parameters | 60-80% |
| Validation | Tune hyperparameters | 10-20% |
| Test | Final unbiased estimate | 10-20% |

- Stratify when classes are imbalanced.
- Shuffle before splitting to avoid ordering bias.
- Never tune on the test set — it leaks information.

```python
from sklearn.model_selection import train_test_split

X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)
```

```python
from sklearn.model_selection import cross_val_score

# k-fold CV: train+validate repeatedly on folds
scores = cross_val_score(model, X, y, cv=5)
print("mean:", scores.mean(), "+/-", scores.std())
```

## Feature Engineering Basics

| Technique | Purpose | Example |
|-----------|---------|---------|
| Scaling (Standard) | Zero mean, unit variance | z-score features |
| Scaling (MinMax) | Bound to [0,1] | Neural net inputs |
| One-hot encoding | Categorical -> binary cols | color: red, green, blue |
| Label encoding | Categorical -> ints | low/med/high -> 0/1/2 |
| Binning | Split continuous into buckets | age -> 18-25, 26-35 |
| Log transform | Tame skewed data | income, prices |
| Interaction terms | Capture feature combos | age * years_experience |
| Feature selection | Keep informative columns | correlation, importance |
| Date/time features | Extract patterns | day-of-week, month, hour |
| Text features | Tokenize + vectorize | TF-IDF |

```python
from sklearn.preprocessing import StandardScaler, OneHotEncoder

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_numeric)

# One-hot: converts categories to binary indicator columns
X_encoded = OneHotEncoder(sparse_output=False).fit_transform(X_categorical)
```

```python
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

pipe = Pipeline([
    ("scale", StandardScaler()),
    ("model", RandomForestClassifier(n_estimators=100))
])
pipe.fit(X_train, y_train)   # scaling only learns on train
```

## Common Patterns / Snippets

### Imbalanced classes

```python
from sklearn.utils.class_weight import compute_class_weight
import numpy as np

weights = compute_class_weight(
    "balanced", classes=np.unique(y_train), y=y_train)
model = LogisticRegression(class_weight="balanced")
```

### Grid search

```python
from sklearn.model_selection import GridSearchCV

param_grid = {"max_depth": [3, 5, 10], "n_estimators": [50, 100]}
search = GridSearchCV(RandomForestClassifier(), param_grid,
                      cv=5, scoring="f1")
search.fit(X_train, y_train)
print(search.best_params_, search.best_score_)
```

### Feature importance

```python
import numpy as np

importances = model.feature_importances_
order = np.argsort(importances)[::-1]
for i in order[:10]:
    print(f"{feature_names[i]:20s} {importances[i]:.3f}")
```

## Key Formulas

```
Linear regression:    yhat = w0 + w1*x1 + ... + wn*xn
Logistic regression:  p = 1 / (1 + exp(-(w·x + b)))
L2 regularization:    loss + lambda * sum(w_i^2)
L1 regularization:    loss + lambda * sum|w_i|
k-NN prediction:      majority vote among k nearest neighbors
k-Means update:       centroid = mean of assigned points
PCA objective:        maximize variance along each component
```

## Real-World Applications

| Domain | Problem | Typical Model |
|--------|---------|---------------|
| Finance | Credit default | Logistic regression, XGBoost |
| Healthcare | Disease risk scoring | Gradient boosting |
| E-commerce | Churn prediction | Random forest |
| Marketing | Customer segmentation | k-Means |
| Search | Ranking URLs | Learning-to-rank, XGBoost |
| Fraud | Transaction scoring | XGBoost + anomaly detection |
| Retail | Demand forecasting | Gradient boosting, time series |

## Common Pitfalls

1. **Data leakage** — Info from test set leaks into training.
2. **No train/val/test separation** — Tuning on test inflates results.
3. **Unscaled features** — k-NN and PCA break without scaling.
4. **Imbalanced data ignored** — Accuracy looks great, model is useless.
5. **Chasing test accuracy** — Overfit to the fixed test set.
6. **Wrong metric** — Accuracy on rare-event data is misleading.
7. **Forgotten baseline** — A dummy/constant predictor is the floor.
8. **Encoding categoricals as ints by default** — Can imply false order.

## Interview Tips

1. Always define the metric before building a model.
2. Explain the bias/variance trade-off with a concrete example.
3. Know when a linear model beats boosted trees (small data, interpretability).
4. Walk through a split: train -> validate -> tune -> test.
5. Mention class imbalance attack plans (oversample, class weights, F1).
6. Discuss leakage: scaling/coding fit on train, transformed for test.
7. Relate algorithms to their complexity: O(n*d) for k-NN predict, etc.
8. Prepare one end-to-end example story with a real metric and result.

> **Parting note:** Always benchmark against a baseline and report
> train/test gap — that single habit catches most modeling mistakes.