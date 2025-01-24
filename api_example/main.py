from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from pydantic import BaseModel

from raglight.rag.simple_rag_api import RAGPipeline
from raglight.models.data_source_model import FolderSource, GitHubSource
from raglight.config.settings import Settings


class QueryModel(BaseModel):
    question: str

Settings.setup_logging()

pipeline = RAGPipeline(knowledge_base=[
GitHubSource(url="https://github.com/Bessouat40/RAGLight"),
GitHubSource(url="https://github.com/Bessouat40/LLMChat")
# FolderSource(path="Path to your knowledge base containing PDF, docx, ...")
], model_name="llama3")

pipeline.build()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/newQuestion")
async def get_images(question: QueryModel):
    response = pipeline.generate(question.question)
    return {"response": response}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)