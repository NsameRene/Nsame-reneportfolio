from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    """Return errors as ``{"error": "<message>"}`` like the old Node API did
    (the frontend reads ``error``). Validation errors add a ``details`` map."""
    response = exception_handler(exc, context)
    if response is None:
        return None

    data = response.data
    if isinstance(data, dict) and "detail" in data:
        response.data = {"error": str(data["detail"])}
    elif response.status_code == 400:
        response.data = {"error": "Validation failed", "details": data}
    return response
