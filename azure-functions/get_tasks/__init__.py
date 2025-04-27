import azure.functions as func
import json
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
        user_id = req.params.get('userId')
        if not user_id:
            try:
                req_body = req.get_json()
            except ValueError:
                pass
            else:
                user_id = req_body.get('userId')

        if not user_id:
            return func.HttpResponse("Missing userId", status_code=400)

        query = "SELECT * FROM c WHERE c.userId=@userId"
        parameters = [{"name": "@userId", "value": user_id}]
        items = list(container.query_items(query=query, parameters=parameters, enable_cross_partition_query=True))

        return func.HttpResponse(json.dumps(items), status_code=200, mimetype="application/json")
    except Exception as e:
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
