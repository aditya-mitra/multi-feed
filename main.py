from locale import YESEXPR
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse

from broadcast import ConnectionManager

app = FastAPI()
app.mount('/client', StaticFiles(directory="client/dist"), name="static")

manager = ConnectionManager()

@app.get('/')
async def index_page():
    return FileResponse("client/dist/index.html")

@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Client #{username} says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{username} left the chat")
