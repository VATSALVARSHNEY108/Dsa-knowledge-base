---
layout: default
title: Computer Vision Cheatsheet
parent: Computer Vision
nav_order: 1
---

# Computer Vision Cheatsheet

Quick reference for CV tasks, image representation, and CNNs.

## Core Concepts

- **Computer Vision** — making machines understand images/videos.
- **Image as data** — H x W x C (RGB=3 channels, grayscale=1).
- **Pixel values** — 0-255 integers per channel. Normalize to
  [0,1] (divide by 255) for most models.
- **Tensor layout** — PyTorch: `(B, C, H, W)`; TensorFlow:
  `(B, H, W, C)`.
- **Channels** assume a fixed input size per architecture.

> Keep the color channel order consistent (RGB) between
> training and inference.

## CV Tasks

| Task | Goal | Output |
|------|------|--------|
| Classification | What object? | Class label |
| Object detection | What + where? | Bounding boxes |
| Semantic segmentation | Pixel regions | Per-pixel class |
| Instance segmentation | Each object mask | Mask per object |
| Pose estimation | Body keypoints | Keypoint coords |
| Image captioning | Describe image | Text |
| OCR | Read text | Recognized characters |

## CNN Building Blocks

- **Conv2d** — learnable filters detecting features.
- **Activation** — ReLU (default), GELU.
- **Pooling** — MaxPool/AvgPool downsample spatial size.
- **BatchNorm** — normalize, speeds training.
- **Flatten + FC** — map features to class scores.
- **Dropout** — regularize, avoid overfitting.

```python
# PyTorch mini CNN
import torch.nn as nn

class TinyCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1), nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(),
            nn.MaxPool2d(2),
        )
        self.fc = nn.Linear(32 * 8 * 8, 10)  # 32x32 input

    def forward(self, x):
        x = self.conv(x)
        x = x.view(x.size(0), -1)
        return self.fc(x)
```

## Common Architectures

| Architecture | Year | Key Idea |
|--------------|------|----------|
| LeNet-5 | 1998 | First popular CNN |
| AlexNet | 2012 | Deeper + ReLU + dropout |
| VGG | 2014 | Small 3x3 filters, deep |
| ResNet | 2015 | Skip connections (residuals) |
| Inception | 2015 | Parallel multi-size convs |
| DenseNet | 2017 | Dense feature reuse |
| YOLO | 2016+ | Real-time one-stage detection |
| U-Net | 2015 | Encoder-decoder, segmentation |
| Vision Transformers | 2020 | Patches + self-attention |

> ResNet solved vanishing gradients with residual connections,
> enabling very deep nets.

## Data Augmentation

- **Geometric** — flip, rotate, crop, scale.
- **Photometric** — brightness, contrast, saturation jitter.
- **Noise-based** — gaussian blur, erasing/cutout.
- **Mix-based** — MixUp, CutMix (blend samples).

```python
# torchvision transforms
from torchvision import transforms

train_tf = transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])
```

## Evaluation Metrics

| Metric | Task | Meaning |
|--------|------|---------|
| Accuracy | Classification | Correct / total |
| Precision | Classification | True pos / predicted pos |
| Recall | Classification | True pos / actual pos |
| F1-score | Classification | Harmonic mean P & R |
| IoU | Segmentation | Overlap / union of mask |
| mAP | Detection | Mean avg precision over IoU |
| Dice/F1 | Segmentation | Overlap metric |

```python
def iou(box_a, box_b):
    x1 = max(box_a[0], box_b[0])
    y1 = max(box_a[1], box_b[1])
    x2 = min(box_a[2], box_b[2])
    y2 = min(box_a[3], box_b[3])
    inter = max(0, x2 - x1) * max(0, y2 - y1)
    area_a = (box_a[2] - box_a[0]) * (box_a[3] - box_a[1])
    area_b = (box_b[2] - box_b[0]) * (box_b[3] - box_b[1])
    union = area_a + area_b - inter
    return inter / union if union > 0 else 0
```

## Transfer Learning

- **Use pretrained** backbones (ResNet, EfficientNet, ViT)
  trained on ImageNet.
- **Two options**:
  - Freeze backbone → train final head (fast, small data).
  - Fine-tune all layers (more data, better results).
- Saves training time and data dramatically.

```python
import torchvision.models as models

model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
for param in model.parameters():
    param.requires_grad = False
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 10)  # your class count
```

## Real-World Application Examples

- **Autonomous driving** — traffic/localization + detection.
- **Medical imaging** — tumor segmentation (U-Net).
- **Retail** — product recognition, shelf monitoring.
- **Security/Monitoring** — face ID, anomaly detection.
- **OCR** — bill/ID scanning, document digitization.
- **Augmented reality** — pose + camera tracking.

## Common Pitfalls

1. **Input size mismatch** — resize/center-crop consistently.
2. **Forgotten normalization** — model output explodes.
3. **Data leakage** — augment on the training set only.
4. **Class imbalance** — use weighted loss / class weights.
5. **Huge image size** — memory blows up; use resize + batch tuning.
6. **No validation metric** — IoU/mAP tells the real story.

## Quick Training Loop Tips

- Use **AdamW** optimizer; lower LR with cosine schedule.
- **Early stopping** on validation metric.
- **Mixed precision** cuts memory/time on GPU.
- Save the **best** checkpoint, not the last one.

> Start small (tiny model on 10 classes), verify the pipeline,
> then scale architecture and augmentations.