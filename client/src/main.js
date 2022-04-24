import './assets/custom.scss'

import { io } from "socket.io-client";

import { changeConnected, changeInputDisplay, addMessage } from "./utils";

let state = {
	isConnected: false,
	username: "",
	sessionId: null,
};

const socket = io({
	transports: ["websocket"],
	path: "/ws/socket.io/",
});

socket.on("connect", () => {
	console.log("socket was connected");
	state = { ...state, isConnected: socket.connected };
	socket.emit("getsid");
	changeConnected(state);
});

socket.on("getsid", (sid) => {
	if (!state.sessionId) state.sessionId = sid;
	// console.log(state.sessionId);
});

socket.on("message", (data) => {
	addMessage(data.username, data.message);
});

socket.on("duplicate_username_disconnect", (sid) => {
	console.log("local state id", state.sessionId, " and server sent", sid);
	if (state.sessionId && state.sessionId === sid) {
		socket.disconnect();
	}
});

socket.on("disconnect", () => {
	console.log("socket was disconnected");
	state = { sessionId: null, username: "", isConnected: socket.connected };
	changeConnected(state);
	changeInputDisplay(state);
});

const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", () => {
	sendButton.setAttribute("disabled", "");

	const text = document.getElementById("text-content");
	console.log("the text content was ", text.value);
	socket.emit("message", text.value);

	text.value = "";
	document.getElementById("text-content").focus();
	sendButton.removeAttribute("disabled");
});

document.getElementById("submit-reset").addEventListener("click", () => {
	const usernameInput = document.getElementById("username-input");

	if (usernameInput.value?.length === 0) return;

	if (state.username.length > 0) {
		// disconnect socket
		state.username = "";
		socket.disconnect();
	} else {
		// set username in socket
		state.username = usernameInput.value;
		if (!state.isConnected) socket.connect();
		socket.emit("setuser", state.username);
	}
	changeInputDisplay(state);
});
