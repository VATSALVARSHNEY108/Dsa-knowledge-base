---
layout: default
title: NLP Cheatsheet
parent: NLP
nav_order: 2
---

# NLP Cheat Sheet

Quick reference for natural language processing: pipeline, preprocessing,
representations, tasks, transformers, metrics, and tools.

## Core Concepts

- **Token:** A unit of text (word, subword, or character).
- **Corpus:** The full collection of text documents.
- **Vocabulary:** The set of all tokens in a corpus.
- **Embedding:** Dense vector representing a token meaning.
- **Intent:** The purpose behind a user utterance (book_flight, etc).
- **Entity:** A real-world mention (person, place, date, product).
- **Attention:** Mechanism weighting relevance between tokens.
- **Context window:** Max tokens a model can see at once.

## NLP Pipeline

```
Raw text
  -> Text preprocessing (clean, normalize)
  -> Tokenization
  -> Representation (BoW / TF-IDF / embeddings)
  -> Task modeling (classify / tag / generate)
  -> Evaluation (accuracy, BLEU, ROUGE)
  -> Deployment (serve, monitor, retrain)
```

## Text Preprocessing

| Step | What It Does | Example |
|------|--------------|---------|
| Lowercasing | Normalize case | "Hello" -> "hello" |
| Remove punctuation | Strip symbols | "hello," -> "hello" |
| Strip whitespace | Trim spaces | " hello " -> "hello" |
| Remove stopwords | Drop "the", "and" | Keep meaningful words |
| Stemming | Crude suffix cut | "fishing" -> "fish" |
| Lemmatization | Vocabulary-aware | "better" -> "good" |
| Expand contractions | Full forms | "don't" -> "do not" |
| Remove URLs/emails | Drop noise | "www.x.com" removed |
| Normalize numbers | Digits to a tag | "123" -> "NUM" |

```python
import re

def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+|www\S+|@\w+|#\w+", " ", text)
    text = re.sub(r"[^a-z\s]", " ", text)   # drop punct + digits
    text = re.sub(r"\s+", " ", text).strip()
    return text
```

## Tokenization

| Method | Splits Into | Used For |
|--------|-------------|----------|
| Whitespace | Words | Simple baselines |
| Regex / punctuation | Words | Classic pipelines (NLTK) |
| Subword (BPE, WordPiece) | Word pieces | BERT, GPT, modern models |
| Byte-level BPE | Bytes | Code, multilingual |
| SentencePiece | Subwords + spaces | T5, Llama |

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
tokens = tokenizer.tokenize("Deep learning rocks!")
ids = tokenizer("Deep learning rocks!")["input_ids"]
print(tokens, ids)
```

## Text Representation Methods

| Method | Type | Idea | Strengths | Weaknesses |
|--------|------|------|-----------|------------|
| BoW | Sparse count | Count word frequencies | Simple, fast | Ignores order, huge vocab |
| TF-IDF | Sparse weighted | Down-weight common words | Better than BoW | Still order-blind |
| Word2Vec | Dense static | Predict context words | Captures similarity | No polysemy |
| GloVe | Dense static | Co-occurrence matrix | Good pretrained | Same limitation |
| FastText | Dense static | Character n-grams | Handles OOV words | Larger models |
| ELMo | Contextual LSTM | Context-aware vectors | Better context | Pre-Transformer |
| BERT/Transformers | Contextual | Attention over tokens | SOTA semantics | Compute heavy |

### Representation choice flow

```
Small data, classic ML  -> TF-IDF + linear model
Similarity / searching  -> Sentence embeddings
Paraphrase / semantic   -> SBERT embeddings
SOTA on any NLP task    -> Pretrained Transformer + fine-tune
```

```python
from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer(max_features=5000, stop_words="english")
X = vectorizer.fit_transform(documents)   # sparse matrix
```

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
vecs = model.encode(["the cat sat", "a feline rested"])
sim = (vecs[0] @ vecs[1])                 # cosine similarity
```

## NLP Tasks

| Task | Input -> Output | Example |
|------|-----------------|---------|
| Text classification | Text -> label | Sentiment, spam |
| Sentiment analysis | Text -> pos/neg/neu | Product reviews |
| Named Entity Recognition (NER) | Text -> entity tags | "Alice at Apple" |
| Part-of-speech (POS) | Text -> tag sequence | noun, verb, adj |
| Machine translation | Text L1 -> Text L2 | EN -> FR |
| Summarization | Long text -> short | Article tl;dr |
| Question answering | History + Q -> span | Chatbots |
| Text generation | Prompt -> text | Mail drafting |
| Textual entailment | A,B -> entail/contradict | Fact checking |
| Semantic similarity | pair text -> score | Search ranking |

### Quick example: sentiment + NER

```python
from transformers import pipeline

sentiment = pipeline("sentiment-analysis")
print(sentiment("I love this product!"))

ner = pipeline("ner", model="dslim/bert-base-NER")
print(ner("Alice works at Apple in London."))
```

## Transformer Basics

```
Encoder  = self-attention + FFN layers -> builds rich input context
Decoder  = masked self-attention + cross-attention + FFN -> generates
Biases:  BERT-like (encoder) for understanding; GPT-like (decoder) for
         generation.

Scaled dot-product attention:
    Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V
```

| Model | Architecture | Use |
|-------|--------------|-----|
| BERT | Encoder | Classification, tagging, embeddings |
| GPT | Decoder | Generation, chat, code |
| T5 | Encoder-Decoder | Translation, summarization |
| DeBERTa / RoBERTa | Encoder variants | SOTA classification |
| Llama / Mistral | Decoder | Open-weight chat |

> **Note:** Pretrain (huge corpus) then fine-tune (small labeled data) is
> the standard recipe — transfer learning saves enormous compute.

## Metrics

| Metric | Compares | Idea | Used For |
|--------|----------|------|----------|
| Accuracy / F1 | Words or labels | Standard classification | Classification |
| BLEU | Precision of n-grams | Cap penalty on short output | Machine translation |
| ROUGE | Recall of n-grams | Overlap with reference | Summarization |
| METEOR | Semantic + exact | Hybrid score | Translation |
| Perplexity | Model probability | Lower is better | Language modeling |
| Semantic similarity | Embedding distance | Meaning-based | Open-ended quality |
| CER / WER | Character/word errors | Speech accuracy | Speech-to-text |

```python
from evaluate import load

def evaluate_generation(candidates, references):
    bleu = load("sacrebleu")
    rouge = load("rouge")
    return {
        "BLEU": bleu.compute(predictions=candidates,
                             references=references)["score"],
        "ROUGE-L": rouge.compute(predictions=candidates,
                                 references=references)["rougeL"],
    }
```

> **BLEU warning:** BLEU rewards exact n-gram overlap; it punishes good
> paraphrases. Always complement with human evaluation for chat/summary.

## Tools / Libraries

| Tool | Purpose |
|------|---------|
| NLTK | Classic NLP: tokenization, lemmatization |
| spaCy | Fast production NLP pipeline + NER |
| Transformers (HF) | Pretrained models, pipeline API |
| Sentence-Transformers | Semantic embeddings |
| Gensim | Word2Vec, topic models |
| Stanford CoreNLP | Language annotation toolkit |
| Stanza | Multilingual neural pipeline |
| Flair/TorchText | Framework integrations |
| evaluate | Metrics library |
| HuggingFace Hub | Model zoo + datasets |

```python
import spacy

nlp = spacy.load("en_core_web_sm")
doc = nlp("Apple buys London startup.")
for token in doc:
    print(token.text, token.lemma_, token.pos_)
```

## Real-World Applications

| Domain | Task | Stack |
|--------|------|-------|
| Search engines | Ranking, query rewrite | BM25 + embeddings |
| Customer support | Chatbots, ticket routing | BERT + RAG |
| Legal / finance | Contract parsing, NER | spaCy + Transformers |
| Healthcare | Clinical note extraction | NER + de-identification |
| E-commerce | Sentiment, review analytics | Fine-tuned BERT |
| Media | Summarization, translation | T5 / MT models |
| Diagnostics | Speech-to-text + QA | Whisper + LLM |
| Code assistants | Code generation | Code LLMs |

## Common Pitfalls

1. **Splitting text after preprocessing** — Data leakage across docs.
2. **Ignoring class imbalance** — Sentiment skewed toward "positive".
3. **Removing stopwords for embeddings** — BERT handles them fine.
4. **Renaming/duplicate labels** — Evaluates hard against clean labels.
5. **BLEU on summaries** — Penalizes valid paraphrases.
6. **Overgrown vocabulary** — Keep max_features + pretrained tokens.
7. **Context window overflow** — Truncation loses meaning; chunk instead.
8. **Case/punct mismatch** — Same word treated differently at train/eval.

## Interview Tips

1. Describe the pipeline: cleaning -> tokenization -> vectorize -> model.
2. Contrast TF-IDF vs contextual embeddings (static vs dynamic).
3. Summarize attention: "score every token against every token".
4. Distinguish encoder vs decoder usage (BERT vs GPT).
5. Choose metrics by task: BLEU for MT, ROUGE for summary, F1 for tags.
6. Discuss data leakage when preprocessing before the train/test split.
7. Know token budgets and how to chunk long documents.

> **Parting note:** Modern NLP is mostly transfer learning — a pretrained
> Transformer fine-tuned on a small labeled set beats hand-built features.