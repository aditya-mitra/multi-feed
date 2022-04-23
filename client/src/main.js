import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:8000/ws";

const username = Date.now().toString();

// const socket = io(SERVER_URL, {
// 	path: `/feed/${username}/ws/`,
// 	transports: ["websocket"],
// });

// socket.on("connect", () => {
// 	console.log("socket was connected");
// });

// socket.io.on("reconnect_error", (err) => {
// 	console.log(err);
// 	socket.close();
// });

const ws = new WebSocket(`ws://localhost:8000/feed/${username}/ws`);

// socket.on("message", (details) => {
// 	console.log("message event", details);
// });

const button = document.getElementById("send-button");
// console.log("button was", button);

button.addEventListener("click", () => {
	console.log("button clicked");
	// socket.emit("message", `The time is ${new Date().getMinutes()}`);

	ws.send(`The time is ${new Date().getMinutes()}`);
});
