from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from helpers.broadcast import ConnectionManager

# from helpers.socket_manager import SocketManager

app = FastAPI()
app.mount("/client", StaticFiles(directory="client/dist"), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = ConnectionManager()


@app.get("/")
async def index_page():
    return FileResponse("client/dist/index.html")


@app.websocket("/feed/{username}/ws")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print("data was ", data)
            await manager.broadcast(f"Client #{username} says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{username} left the chat")
