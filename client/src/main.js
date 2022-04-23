// import "./styles/custom.scss"

import { io } from "socket.io-client";

import { changeConnected, changeInputState, addMessage } from "./utils";

const state = {
	isConnected: false,
	username: "",
};

const socket = io({
	transports: ["websocket"],
	path: "/ws/socket.io/",
});

socket.on("connect", () => {
	console.log("socket was connected");
	changeConnected({ ...state, isConnected: socket.connected });
});

socket.on("message", (data) => {
	addMessage(data.username, data.message);
});

socket.on("disconnect", () => {
	console.log("socket was disconnected");
	changeConnected({ ...state, isConnected: socket.connected });
});

const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", () => {
	sendButton.disabled = true;

	const text = document.getElementById("text-content");
	console.log("the text content was ", text.value);
	socket.emit("message", text.value);

	text.value = "";
	sendButton.disabled = false;
});

document.getElementById("submit-disconnect").addEventListener("click", () => {
	const usernameInput = document.getElementById("username-input");

	if (usernameInput.value?.length === 0) return;

	if (state.username.length > 0) {
		// disconnect socket
		state.username = "";
		socket.disconnect();
	} else {
		// set username in socket
		state.username = usernameInput.value;
		socket.connect();
		socket.emit("setuser", state.username);
	}

	changeInputState(state);
});
