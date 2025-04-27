import azure.functions as func
import json
from azure.cosmos import CosmosClient, exceptions

COSMOS_DB_URL = "https://shellicia.documents.azure.com:443/"
COSMOS_DB_KEY = "KN6AxAxjTEAmEqr86UfxAplUGZ0Ruw5TxWj85JiMmsevjnUBTHbi4xvlM1oju72kRv8PDpyXpAb9ACDbmZvCAQ=="
COSMOS_DB_DATABASE_NAME = "nimbus-todo-db"
COSMOS_DB_CONTAINER_NAME = "tasks"

client = CosmosClient(COSMOS_DB_URL, credential=COSMOS_DB_KEY)
database = client.get_database_client(COSMOS_DB_DATABASE_NAME)
container = database.get_container_client(COSMOS_DB_CONTAINER_NAME)

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        task_id = req.route_params.get('id')
        user_id = req.params.get('userId')

        if not task_id or not user_id:
            return func.HttpResponse("Missing task id or userId", status_code=400)

        container.delete_item(item=task_id, partition_key=user_id)

        return func.HttpResponse(f"Task {task_id} deleted successfully.", status_code=200)
    except exceptions.CosmosResourceNotFoundError:
        return func.HttpResponse("Task not found.", status_code=404)
    except Exception as e:
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
