from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from pydantic import BaseModel

from raglight.rag.simple_rag_api import RAGPipeline
from raglight.models.data_source_model import FolderSource, GitHubSource
from raglight.config.settings import Settings

class QueryModel(BaseModel):
    question: str

class SourceModel(BaseModel):
    sourceType: str
    sourcePath: str

Settings.setup_logging()

pipeline = RAGPipeline(knowledge_base=[
    GitHubSource(url="https://github.com/Bessouat40/RAGLight"),
    GitHubSource(url="https://github.com/Bessouat40/LLMChat")
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
async def get_answer(question: QueryModel):
    response = pipeline.generate(question.question)
    return {"response": response}
@app.post("/addSource")
async def add_source(source: SourceModel):
    """
    Adds a new source (GitHub or Folder) to the knowledge base,
    then rebuilds the pipeline if necessary.
    """
    if source.sourceType.lower() == "github":
        pipeline.knowledge_base.append(GitHubSource(url=source.sourcePath))
    elif source.sourceType.lower() == "folder":
        pipeline.knowledge_base.append(FolderSource(path=source.sourcePath))
    else:
        return {"error": "Unsupported source type."}

    pipeline.build()
    return {"message": f"Source {source.sourcePath} added as {source.sourceType}"}

@app.get("/listSources")
def list_sources():
    """
    Returns the knowledge base as a list 
    [{sourceType, sourcePath}, ...]
    """
    result = []
    for src in pipeline.knowledge_base:
        if isinstance(src, GitHubSource):
            src_type = "github"
            src_path = src.url
        elif isinstance(src, FolderSource):
            src_type = "folder"
            src_path = src.path
        else:
            src_type = "unknown"
            src_path = "???"
        result.append({"sourceType": src_type, "sourcePath": src_path})
    return result


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
