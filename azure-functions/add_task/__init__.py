import azure.functions as func
import json
import uuid
from datetime import datetime
from azure.cosmos import CosmosClient

COSMOS_DB_URL = "https://shellicia.documents.azure.com:443/"
COSMOS_DB_KEY = "KN6AxAxjTEAmEqr86UfxAplUGZ0Ruw5TxWj85JiMmsevjnUBTHbi4xvlM1oju72kRv8PDpyXpAb9ACDbmZvCAQ=="
COSMOS_DB_DATABASE_NAME = "nimbus-todo-db"
COSMOS_DB_CONTAINER_NAME = "tasks"

client = CosmosClient(COSMOS_DB_URL, credential=COSMOS_DB_KEY)
database = client.get_database_client(COSMOS_DB_DATABASE_NAME)
container = database.get_container_client(COSMOS_DB_CONTAINER_NAME)

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        data = req.get_json()
        description = data.get('description')
        priority = data.get('priority')
        source = data.get('source', 'Nimbus Todo')
        userId = data.get('userId')
        status = data.get('status', 'To Do')

        if not description or not userId:
            return func.HttpResponse("Missing description or userId", status_code=400)

        task = {
            "id": str(uuid.uuid4()),
            "description": description,
            "priority": priority,
            "source": source,
            "userId": userId,
            "status": status,
            "createdAt": datetime.utcnow().isoformat()
        }

        container.create_item(task)

        return func.HttpResponse(json.dumps(task), status_code=201, mimetype="application/json")
    except Exception as e:
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
