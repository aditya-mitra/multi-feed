const connectStatusDiv = document.getElementById("connect-attempt-success");

export function changeConnected(state) {
	if (!state.isConnected) {
		state.isConnected = false;
		connectStatusDiv.classList.remove("is-success");
		connectStatusDiv.classList.add("is-danger");
		connectStatusDiv.innerText = "Not connected ...";
	} else {
		state.isConnected = true;
		connectStatusDiv.classList.remove("is-danger");
		connectStatusDiv.classList.add("is-success");
		connectStatusDiv.innerText = "Connected!";
	}
}

const submitDisconnectInput = document.getElementById("submit-disconnect");
const usernameInput = document.getElementById("username-input");
const textContent = document.getElementById("text-content");
const sendButton = document.getElementById("send-button");

export function changeInputDisplay(state) {
	if (state.username.length === 0) {
		submitDisconnectInput.innerText = "Submit";
		usernameInput.removeAttribute("disabled");
		textContent.setAttribute("disabled", "");
		sendButton.setAttribute("disabled", "");
	} else {
		submitDisconnectInput.innerText = "Disconnect";
		usernameInput.setAttribute("disabled", "");
		textContent.removeAttribute("disabled");
		sendButton.removeAttribute("disabled");
	}
}

const messagesContainer = document.getElementById("messages-container");

export function addMessage(author, text) {
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

	messagesContainer.appendChild(child);
}
