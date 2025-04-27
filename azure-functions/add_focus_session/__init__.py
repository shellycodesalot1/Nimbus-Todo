import azure.functions as func
import json
import uuid
from datetime import datetime
from azure.cosmos import CosmosClient

COSMOS_DB_URL = "https://shellicia.documents.azure.com:443/"
COSMOS_DB_KEY = "KN6AxAxjTEAmEqr86UfxAplUGZ0Ruw5TxWj85JiMmsevjnUBTHbi4xvlM1oju72kRv8PDpyXpAb9ACDbmZvCAQ=="
COSMOS_DB_DATABASE_NAME = "nimbus-todo-db"
COSMOS_DB_CONTAINER_NAME = "focus-sessions"  # ✅ new container for focus sessions!

client = CosmosClient(COSMOS_DB_URL, credential=COSMOS_DB_KEY)
database = client.get_database_client(COSMOS_DB_DATABASE_NAME)
container = database.get_container_client(COSMOS_DB_CONTAINER_NAME)

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        data = req.get_json()
        userId = data.get('userId')
        focusMinutes = data.get('focusMinutes')
        breakMinutes = data.get('breakMinutes')
        autoBreak = data.get('autoBreak')
        status = data.get('status')

        if not userId or focusMinutes is None:
            return func.HttpResponse("Missing userId or focusMinutes", status_code=400)

        session = {
            "id": str(uuid.uuid4()),
            "userId": userId,
            "focusMinutes": focusMinutes,
            "breakMinutes": breakMinutes,
            "autoBreak": autoBreak,
            "status": status,
            "timestamp": datetime.utcnow().isoformat()
        }

        container.create_item(session)

        return func.HttpResponse(json.dumps(session), status_code=201, mimetype="application/json")
    except Exception as e:
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
