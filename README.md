# LLMChat 🎉

LLMChat is a minimalist application designed to test and interact with your LLM in a user-friendly way. Seamlessly integrate local and GitHub-based knowledge to enhance your AI's contextual capabilities. 🌟

[[🎥 Demonstration]](./media/raglight_chat.mov)

## Features 🚀

- **Interactive Interface:** Use LLMChat like ChatGPT but tailored to your specific knowledge base. 💬
- **Custom Knowledge Sources:** Link local folders and GitHub repositories to create a dynamic, up-to-date context for your LLM. 📂
- **Privacy-Friendly:** Runs locally, ensuring complete control over your data. 🔒

## Installation ⚙️

1. Install dependencies and start the backend:

```bash
python -m pip install -r api_example/requirements.txt
```

1. Install dependencies and start the frontend:

```bash
npm i && npm run start
```

## API Example 🖥️

You can find an API example in the `api_example/main.py` file.

[RAGLight](https://github.com/Bessouat40/RAGLight) is the core framework powering LLMChat. Install it via PyPI.

## How It Works 🤔

LLMChat leverages RAGLight to index and process knowledge bases, making them available for your LLM to query. It supports:

- GitHub repositories 🧑‍💻
- Local folders with PDFs, code, and more 📄

### Example snippet using RAGLight 📜

```python
from raglight.rag.simple_rag_api import RAGPipeline
from raglight.models.data_source_model import FolderSource, GitHubSource

pipeline = RAGPipeline(knowledge_base=[
FolderSource(path="<path to folder>/knowledge_base"),
GitHubSource(url="https://github.com/Bessouat40/RAGLight")
], model_name="llama3")

pipeline.build()
response = pipeline.generate("What is LLMChat and how does it work?")
print(response)
```
