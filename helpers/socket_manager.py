from typing import Union

import socketio
from fastapi import FastAPI


class SocketManager:
    def __init__(
        self,
        app: FastAPI,
        mount_location: str = "/ws",
        socketio_path: str = "socket.io",
        cors_allowed_origins: Union[str, list] = "*",
        async_mode: str = "asgi",
    ) -> None:
        self._sio = socketio.AsyncServer(
            async_mode=async_mode, cors_allowed_origins=cors_allowed_origins
        )
        self._app = socketio.ASGIApp(
            socketio_server=self._sio, socketio_path=socketio_path
        )
        app.mount(mount_location, self._app)

    @property
    def on(self):
        return self._sio.on

    @property
    def emit(self):
        return self._sio.emit

    @property
    def event(self):
        return self._sio.event


"""
sm = SocketManager(app=app)

@sm.event
def connect(sid, environ):
    print("connected ", sid, " and ", environ)

@sm.event('message')
async def message(sid, data):
    print('the sid was ', sid, ' and the data was ',data);
    await sm.emit('messge', {'hey':'john'})

"""
