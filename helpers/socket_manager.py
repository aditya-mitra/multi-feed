import socketio
from fastapi import FastAPI
from os import getenv


class SocketManager:
    def __init__(
        self,
        app: FastAPI,
    ) -> None:
        mgr = socketio.AsyncRedisManager(url=getenv('REDIS_URI'))
        self._sio = socketio.AsyncServer(client_manager=mgr, async_mode="asgi", cors_allowed_origins="*")
        self._app = socketio.ASGIApp(
            socketio_server=self._sio, socketio_path="socket.io"
        )
        app.mount("/ws", self._app)

    @property
    def on(self):
        return self._sio.on

    @property
    def emit(self):
        return self._sio.emit

    @property
    def event(self):
        return self._sio.event

    @property
    def save_session(self):
        return self._sio.save_session

    @property
    def get_session(self):
        return self._sio.get_session

