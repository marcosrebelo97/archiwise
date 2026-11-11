from fastapi import FastAPI
from routers import documents
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()
app.include_router(documents.router, prefix="/api/archiwise")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)