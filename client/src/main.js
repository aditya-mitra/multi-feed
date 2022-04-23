// import "./styles/custom.scss"

import { io } from "socket.io-client";

const connectAttemptDiv = document.getElementById("connect-attempt");
const connectSuccessDiv = document.getElementById("connect-success");

function changeConnected(isConnected) {
	if (!isConnected) {
		connectAttemptDiv.style.display = "block";
		connectSuccessDiv.style.display = "none";
	} else {
		connectAttemptDiv.style.display = "none";
		connectSuccessDiv.style.display = "block";
	}
}

changeConnected(false);

function addMessage(author, text) {
	const date = new Date();
	const child = document.createElement("div");
	child.id = `${date.getHours}-${date.getMinutes}-${date.getSeconds}`;

	child.innerHTML = `
  <div class="block my-1">
    <article class="tile is-child notification is-primary">
      <p class="title">${author}</p>
      <p class="subtitle">${text}</p>
    </article>
  </div>
  `;

	document.getElementById("messages-container").appendChild(child);
}

const socket = io({
	transports: ["websocket", "polling"],
	path: "/ws/socket.io/"
});

socket.on("connect", () => {
	console.log("socket was connected");
  socket.emit("setuser", `happy-user-1`)
	changeConnected(true);
});

// const ws = new WebSocket(`ws://localhost:8000/feed/${username}/ws`);

socket.on("message", (details) => {
	addMessage("anybody", details);
});

const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", () => {
	sendButton.disabled = true;

	const text = document.getElementById("text-content");
	console.log("the text content was ", text.value);
	socket.emit("message", text.value);

	text.value = "";
	sendButton.disabled = false;
	// ws.send(`The time is ${new Date().getMinutes()}`);
});
