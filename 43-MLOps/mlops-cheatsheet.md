# MLOps Cheatsheet

Quick reference for Machine Learning operations: lifecycle,
versioning, serving, monitoring, and tools.

## Core Concepts

- **MLOps** — applying DevOps practices to machine learning.
- **Goal** — reliable, repeatable, monitored ML in production.
- **Three layers** — Data, Model, Code (all need versioning).
- **Three feedback loops** analyzing drift, retraining, rollout.
- **Experiment to production** — one path, reproducible.

> An ML model in production is a system: data pipelines,
> model versioning, serving, and monitoring all matter.

## ML Lifecycle

```
Data collection → Prep/Augment → Train → Evaluate →
Validate → Deploy → Monitor → (retrain loop)
```

Stages repeatedly visit versioning + registry + CI/CD.

## Versioning Essentials

- **Code** — git (each experiment tagged).
- **Data** — dataset IDs / checksums / DVC.
- **Model** — registry with metrics, metadata (MLflow).
- **Environment** — container image (Docker) / conda env.

| Item | Tool | Why |
|------|------|-----|
| Code | Git | History, branching, collaboration |
| Data | DVC / S3 + hash | Reproducibility |
| Model | MLflow / registry | Track params + metric |
| Env | Docker / conda | Reproduce runtime |

## Experiment Tracking

```python
import mlflow

mlflow.set_tracking_uri("sqlite:///mlflow.db")
with mlflow.start_run():
    mlflow.log_param("lr", 0.01)
    mlflow.log_param("model", "xgboost")
    mlflow.log_metric("accuracy", 0.93)
    mlflow.log_artifact("model.pkl")
```

> Log params, metrics, data snapshot, and model artifact on
> every run so you can compare and revert.

## Training / Validation Workflow

1. Train on a train set; validate on holdout.
2. Compare many runs in the tracking UI.
3. Pick the best by the metric that matters (F1, mAP, RMSE).
4. Register it to the model registry as `candidate`.
5. Run full re-validation on a fixed test set — one time only.

> Never tune on the test set. Lock it from day one.

## Model Serving Options

| Path | Method | Use |
|------|--------|-----|
| Online serving | REST/gRPC endpoint | Real-time predictions |
| Batch inference | Cron job / scheduled job | Offline scoring |
| Stream inference | Kafka + model worker | Click/purchase events |
| Edge/on-device | ONNX/TFLite/SONNX | Mobile, embedded |

Example REST endpoint (FastAPI):

```python
from fastapi import FastAPI
import pickle

app = FastAPI()
model = pickle.load(open("model.pkl", "rb"))

@app.post("/predict")
def predict(features: dict):
    pred = model.predict([features["data"]])
    return {"prediction": int(pred[0])}
```

## Monitoring & Drift

- **Data drift** — input distribution changed over time.
- **Prediction drift** — model output distribution shifted.
- **Model drift** — performance degraded (accuracy drops).

| Signal | How to catch | Action |
|--------|--------------|--------|
| Input type errors | Schema validation | Alert / retrain |
| Feature distribution | Statistical tests (PSI, KS) | Alert |
| Output distribution | Monitor predicted classes | Alert |
| Business metric | Track in production | Retrain trigger |

> The model that was great on Friday can silently break
> next quarter. Monitor continuously.

## CI/CD for ML (Pipelines)

- **CI** — validate code, lint, tests, data schema, small train.
- **CD** — deploy trained model to staging; validate; roll to prod.
- **Orchestration** — Airflow/Kubeflow for multi-step pipeline.

Implement steps as repeatable jobs: data → train → evaluate →
register → deploy. Everything idempotent.

## MLOps Tools

| Tool | Purpose |
|------|---------|
| MLflow | Experiment tracking, registry |
| DVC | Data versioning |
| Airflow / Prefect | Orchestration |
| Kubeflow / TFX | Kubernetes-native ML |
| Docker + Kubernetes | Packaging + serving |
| Prometheus + Grafana | Monitoring dashboards |
| Evidently / WhyLabs | Drift + quality monitoring |
| Feast | Feature store |

## Real-World Application Examples

- **Fraud detection** — online endpoint, monitored hourly.
- **Recommendations** — batch + online hybrid, daily retrain.
- **Logistics** — demand forecast batch; drift alerts on holidays.
- **Healthcare** — strict validation gates and audit logs.

## Common Pitfalls

1. **No data versioning** — can't reproduce experiments.
2. **Predictions vs training mismatch** — different features
   between train and serving (fix: feature store).
3. **Silently stale models** — no drift checks.
4. **Retraining in prod by hand** — automate the pipeline.
5. **Testing only on happy path** — evaluate edge cases.
6. **No rollback plan** — keep the previous model artifact.

## Interview / Exam Tips

- Distinguish **training time** vs **serving time** skew.
- Explain **model registry** and why it matters.
- Describe the **retrain loop** driven by drift signals.
- Know **online vs batch vs stream** serving.
- Show you treat models as versioned, monitored products.

> MLOps is the difference between a demo notebook and
> software that keeps working. Reliability is the product.