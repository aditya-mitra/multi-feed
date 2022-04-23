from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from requests import session

from helpers.socket_manager import SocketManager

app = FastAPI()
app.mount("/client", StaticFiles(directory="client/dist"), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sm = SocketManager(app=app)

usernames = dict()

@sm.event
async def connect(sid, environ):
    print(f"the client connected with sid {sid}")

@sm.event
async def getsid(sid):
    await sm.emit('getsid', sid)

@sm.event
async def message(sid, data):
    print(f'sid {sid}')
    session = await sm.get_session(sid)
    print(f"message from {session}")
    await sm.emit("message", {"username": session["username"], "message": data})


@sm.event
async def setuser(sid, data):
    # disconnect if user was already present
    print("before", usernames)
    
    if data in usernames:
        temp = usernames.get(data)
        print(f'{temp} was already present')
        await sm.emit('duplicate_username_disconnect', temp)
    
    await sm.save_session(sid, {"username": data})
    usernames[data] = sid
    print('after', usernames)

@sm.event
def disconnect(sid):
    print(f'the client with sid {sid} got disconnected')


@app.get("/")
async def index_page():
    return FileResponse("client/dist/index.html")

@app.get('/best')
async def best_page():
    return {'working': 'fine'}