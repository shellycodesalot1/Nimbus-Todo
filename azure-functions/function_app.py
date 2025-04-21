import azure.functions as func
import logging
import json
import uuid
from datetime import datetime

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# --------------------- Add Task ---------------------
@app.route(route="add_task", methods=["POST"])
def add_task(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('⚙️ AddTask HTTP trigger function processed a request.')

    try:
        data = req.get_json()
        description = data.get('description')
        priority = data.get('priority')

        if not description or not priority:
            return func.HttpResponse(
                "Missing task 'description' or 'priority'.",
                status_code=400
            )

        task = {
            "id": str(uuid.uuid4()),
            "description": description,
            "priority": priority,
            "completed": False,
            "createdAt": datetime.utcnow().isoformat()
        }

        return func.HttpResponse(
            json.dumps(task),
            status_code=200,
            mimetype="application/json"
        )

    except Exception as e:
        logging.error(f"Error processing request: {e}")
        return func.HttpResponse("Invalid request body.", status_code=400)

# --------------------- Delete Task ---------------------
@app.route(route="delete_task/{task_id}", methods=["DELETE"])
def delete_task(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('🗑️ DeleteTask HTTP trigger function processed a request.')

    task_id = req.route_params.get('task_id')

    if not task_id:
        return func.HttpResponse("Task ID is required.", status_code=400)

    # Simulated delete
    logging.info(f"Task {task_id} would be deleted.")

    return func.HttpResponse(f"Task {task_id} deleted successfully.", status_code=200)

# --------------------- Edit Task ---------------------
@app.route(route="edit_task/{task_id}", methods=["PUT"])
def edit_task(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('📝 EditTask HTTP trigger function processed a request.')

    task_id = req.route_params.get("task_id")

    if not task_id:
        return func.HttpResponse("Task ID is required.", status_code=400)

    try:
        data = req.get_json()
    except ValueError:
        return func.HttpResponse("Invalid JSON body", status_code=400)

    allowed_fields = ["description", "priority", "completed"]
    updated_fields = {key: data[key] for key in allowed_fields if key in data}

    if not updated_fields:
        return func.HttpResponse("No valid fields to update.", status_code=400)

    logging.info(f"Task {task_id} would be updated with: {updated_fields}")

    response = {
        "id": task_id,
        **updated_fields,
        "updatedAt": datetime.utcnow().isoformat()
    }

    return func.HttpResponse(json.dumps(response), status_code=200, mimetype="application/json")
