import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:8000/";

const username = Date.now().toString();

// const socket = io(SERVER_URL, {
// 	path: `/feed/${username}/ws/`,
// 	transports: ["websocket"],
// });

// socket.io.on("reconnect_error", (err) => {
// 	console.log(err);
// 	socket.close();
// });
const socket = io({
	transports: ["websocket"],
  path: '/ws/socket.io/'
});

socket.on("connect", () => {
	console.log("socket was connected");
});

// const ws = new WebSocket(`ws://localhost:8000/feed/${username}/ws`);

socket.on("message", (details) => {
	console.log("message event", details);
});

const button = document.getElementById("send-button");
// console.log("button was", button);

button.addEventListener("click", () => {
	console.log("button clicked");
	socket.emit("message", `The time is ${new Date().getMinutes()}`);

	// ws.send(`The time is ${new Date().getMinutes()}`);
});
