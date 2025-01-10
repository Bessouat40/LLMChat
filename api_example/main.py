import warnings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

import os

from pydantic import BaseModel

from raglight.rag.builder import Builder
from raglight.config.settings import Settings
from dotenv import load_dotenv

load_dotenv()

class QueryModel(BaseModel):
    question: str

persist_directory = os.environ.get('PERSIST_DIRECTORY')
model_embeddings = os.environ.get('MODEL_EMBEDDINGS')
model_name = os.environ.get('MODEL_NAME')
system_prompt_directory = os.environ.get('SYSTEM_PROMPT_DIRECTORY')
collection_name = os.environ.get('COLLECTION_NAME')

rag = Builder() \
.with_embeddings(Settings.HUGGINGFACE, model_name=model_embeddings) \
.with_vector_store(Settings.CHROMA, persist_directory=persist_directory, collection_name=collection_name) \
.with_llm(Settings.OLLAMA, model_name=model_name, system_prompt_file=system_prompt_directory) \
.build_rag()

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
    response = rag.question_graph(question.question)
    return {"response": response}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)