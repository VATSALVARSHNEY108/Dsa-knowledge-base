# Deep Learning Cheat Sheet

Quick reference for deep learning: network architectures, activations,
losses, optimizers, regularization, and the training loop.

## Core Concepts

- **Neuron:** Computes weighted sum of inputs then applies an activation.
- **Layer:** Collection of neurons; stack layers to build depth.
- **Weights / biases:** Learnable parameters updated during training.
- **Forward pass:** Predictions flow input -> output.
- **Backpropagation:** Error flows backward to compute gradients.
- **Epoch:** One full pass over the training data.
- **Batch size:** Number of samples per gradient update.
- **Learning rate:** Step size for weight updates.
- **Loss function:** Measures prediction error vs ground truth.

> **Deep vs shallow:** "Deep" means multiple hidden layers capture
> hierarchies — edges -> parts -> objects (vision) or words -> phrases ->
> meaning (NLP).

## Architecture Types

| Architecture | Strengths | Typical Use | Pitfalls |
|--------------|-----------|-------------|----------|
| MLP (Dense) | Simple, universal approx | Tabular data | Ignores spatial/temporal order |
| CNN | Spatial locality, shared weights | Images, vision | Hard on long sequences |
| RNN | Sequential state | Time series, text | Vanishing gradients, slow |
| LSTM | Long-range memory (gates) | Text, speech | Expensive to train |
| GRU | Lighter LSTM variant | Sequential tasks | Slightly less expressive |
| Transformer | Parallel attention, scalably | LLMs, all modern NLP/CV | Needs huge data/compute |

### Architecture comparison

| Property | MLP | CNN | RNN/LSTM | Transformer |
|----------|-----|-----|----------|-------------|
| Handles sequences | No | Limited | Yes | Yes (parallel) |
| Position invariance | No | Yes (locally) | Recurrent | Positional encoding |
| Long range context | No | Via depth | Gated (LSTM) | Attention window |
| Parallel training | No | Yes | No (sequential) | Yes |
| Data hungry | Low | Medium | Medium | Very high |

## Activation Functions

| Function | Formula | Output Range | Best For | Notes |
|----------|---------|--------------|----------|-------|
| ReLU | max(0, x) | [0, inf) | Hidden layers | Default; dying neuron risk |
| Leaky ReLU | x if x>0 else a*x | (-inf, inf) | Hidden layers | Fixes dying ReLU (a~0.01) |
| Sigmoid | 1/(1+e^-x) | (0, 1) | Binary prob | Vanishing gradient outside 0 |
| Tanh | (e^x-e^-x)/(e^x+e^-x) | (-1, 1) | Hidden layers | Zero-centered, nicer than sigmoid |
| Softmax | e^x / sum e^x | (0,1) sums to 1 | Multi-class prob | Pure probabilities |
| GELU | x * Phi(x) | (-inf, inf) | Transformers | Smoother than ReLU |

### Quick choice guide

```
Hidden layers  -> ReLU (default), LeakyReLU
Binary output  -> Sigmoid
Multi-class    -> Softmax (last layer)
Regression     -> No activation on output
```

```python
import torch.nn as nn

activation = nn.ReLU()        # hidden layers
binary_probs = nn.Sigmoid()   # single-output probability
logits = nn.Softmax(dim=1)    # class probabilities
```

## Loss Functions

| Task | Loss | Notes |
|------|------|-------|
| Binary classification | BCEWithLogits | Combines sigmoid + cross entropy |
| Multi-class | CrossEntropyLoss | LogSoftmax + NLL built in |
| Regression | MSELoss | Penalizes large errors |
| Regression | L1Loss | Robust to outliers |
| Contrastive / embeddings | TripletMarginLoss | Anchors, positives, negatives |
| Generation vocab | CrossEntropy over tokens | Standard for LLM pretraining |

```python
import torch.nn as nn

ce = nn.CrossEntropyLoss()              # takes raw logits
bce = nn.BCEWithLogitsLoss()            # takes raw logit, not prob
mse = nn.MSELoss()

loss = ce(logits, labels)               # labels: int class ids
```

## Optimizers

| Optimizer | Update Idea | Use When | Tips |
|-----------|-------------|----------|------|
| SGD | Plain gradient step + momentum | Prefer simple, works | Tune LR carefully |
| SGD + momentum | Accumulates velocity | Escapes ravines | Momentum ~0.9 |
| Adam | Per-parameter adaptive LR | Default, fast start | Beta2 0.999 |
| AdamW | Adam + decoupled weight decay | Transformers (BERT/GPT) | Preferred over Adam |
| RAdam / LAMB | Rectified/very large batch | Large batch training | Saves tuning |

### Key formula

```
SGD:   w <- w - lr * grad
Momentum:  v <- beta*v + grad ;  w <- w - lr*v
Adam:  exponentially weighted grad & grad^2 -> normalized step
```

> **Rule of thumb:** start with Adam lr=1e-3, switch to AdamW for
> Transformers (lr ~1e-4 or 3e-5 when fine-tuning).

```python
import torch.optim as optim

optimizer = optim.AdamW(model.parameters(), lr=1e-4, weight_decay=0.01)
scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=10)
```

## Regularization

| Technique | What It Does | Typical Setting |
|-----------|--------------|-----------------|
| L1/L2 (weight decay) | Punishes large weights | weight_decay ~0.01-0.05 |
| Dropout | Randomly zero neurons at train | p=0.3-0.5 (dense), 0.1 (attention) |
| BatchNorm | Normalize layer inputs | Batch > 8 recommended |
| LayerNorm | Normalize per-sample | Used in Transformers |
| Early stopping | Stop when val loss plateaus | Patience 5-10 epochs |
| Data augmentation | Synthesize more variety | Domain specific |
| Label smoothing | Soften one-hot targets | 0.1 typical |

### Dropout + BatchNorm

```python
import torch.nn as nn

class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Sequential(
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.5),          # disable neurons at train
            nn.BatchNorm1d(64),       # normalize activations
            nn.Linear(64, 10),
        )

    def forward(self, x):
        return self.fc(x)
```

## Training Loop Snippet

```python
import torch
import torch.nn as nn
import torch.optim as optim

model = Net()
opt = optim.AdamW(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()

def train_one_epoch():
    model.train()
    total = 0
    for xb, yb in train_loader:
        opt.zero_grad()
        logits = model(xb)
        loss = loss_fn(logits, yb)
        loss.backward()
        opt.step()                     # update weights
        total += loss.item()
    return total / len(train_loader)

def evaluate():
    model.eval()                       # disables dropout/batchnorm
    correct = total = 0
    with torch.no_grad():
        for xb, yb in val_loader:
            preds = model(xb).argmax(dim=1)
            correct += (preds == yb).sum().item()
            total += len(yb)
    return correct / total

for epoch in range(50):
    train_loss = train_one_epoch()
    val_acc = evaluate()
    print(f"epoch {epoch}: loss={train_loss:.3f} acc={val_acc:.3f}")
```

> **model.eval() vs model.train():** Always toggle. Dropout and BatchNorm
> behave differently at train vs inference.

## Hyperparameters

| Hyperparameter | Effect | Typical Range |
|----------------|--------|---------------|
| Learning rate | Step size; too high diverges, too low slow | 1e-4 to 1e-2 (Adam) |
| Batch size | Gradient noise + memory | 16-512 |
| Epochs / steps | Total training budget | stop by val curve |
| Hidden width | Capacity | scales with data |
| Hidden depth | Capacity + hierarchy | 2-20+ layers |
| Dropout rate | Regularization strength | 0.1-0.5 |
| Weight decay | L2 penalty | 1e-5 to 1e-2 |
| Warmup steps | Prevent early instability | 1-10% of steps |
| Gradient clipping | Stability for RNN/LM | max_norm 1.0 |

### Learning rate schedule

```
Too high: loss explodes / NaN
Too low:  loss barely moves
Good:     fast descent then gentle plateau

Common schedules: cosine, linear decay, step decay, warmup + decay
```

## Key Formulas

```
Neuron output:      z = sum(w_i * x_i) + b ;  out = activation(z)
Cross entropy:      -sum(y * log(p))
RNN hidden:         h_t = activation(W_h h_{t-1} + W_x x_t)
LSTM gates:         input/forget/output gates regulate memory cell
Attention (scaled): softmax(Q K^T / sqrt(d_k)) V
Adam step:          m,bias-adjusted / sqrt(v + eps)
BatchNorm:          (x - mean) / sqrt(var + eps) * gamma + beta
```

## Common Patterns / Snippets

### Train / val split and dataloader

```python
from torch.utils.data import DataLoader, random_split

train_sub, val_sub = random_split(dataset, [0.8, 0.2])
train_loader = DataLoader(train_sub, batch_size=64, shuffle=True)
val_loader = DataLoader(val_sub, batch_size=64, shuffle=False)
```

### Early stopping

```python
best = float("inf")
patience = 5
no_improve = 0

for epoch in range(100):
    val_loss = train_and_validate()
    if val_loss < best - 1e-4:
        best, no_improve = val_loss, 0
        torch.save(model.state_dict(), "best.pt")
    else:
        no_improve += 1
        if no_improve >= patience:
            break                      # stop, restore best weights
```

### Transfer learning (fine-tune)

```python
import torchvision.models as models
import torch.nn as nn

backbone = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
backbone.fc = nn.Linear(512, NUM_CLASSES)   # swap classifier head
```

## Real-World Applications

| Domain | Model | Task |
|--------|-------|------|
| Vision | CNN/Transformer | Image classification, detection |
| NLP | Transformer | Translation, chat, summarization |
| Speech | Conformer/Whisper | Speech-to-text |
| Bio | AlphaFold-style | Protein structure prediction |
| Autonomous driving | CNN + LSTM | Perception and planning |
| Audio | CNN/LSTM | Music tagging, anomaly detection |
| Gaming/robotics | RL + deep nets | Control policies |

## Common Pitfalls

1. **Forgetting model.train()/eval()** — Dropped accuracy at inference.
2. **No data scaling/normalization** — Slow or unstable convergence.
3. **Learning rate too high** — Loss diverges to NaN.
4. **Imbalanced classes + plain CE** — Model predicts only majority class.
5. **No validation discipline** — Can't detect overfitting in time.
6. **Hard-coded batch sizes** — Breaks batch-norm on tiny final batches.
7. **Saturating activations** — Sigmoid/tanh in deep networks vanishe.
8. **Risk of label leakage** — Augmentations applied after the split.
9. **Reproducibility ignored** — Set seeds and log everything.

## Interview Tips

1. Explain backpropagation at a high level (chain rule on the graph).
2. Compare optimizers: SGD-momentum vs Adam trade-offs.
3. Know when dropout/batchnorm hurt (small batches, tiny models).
4. Explain vanishing gradients: sigmoid/tanh deep stacks, LSTM gates fix.
5. Describe attention in one sentence: weighted relevance over tokens.
6. Walk the training loop: forward, loss, backward, step, schedule.
7. Mention scaling data, seeds, logs, and eval-mode as hygiene.

> **Parting note:** Deep learning is empirical — small, reproducible
> experiments on a validation set beat big brittle configurations.