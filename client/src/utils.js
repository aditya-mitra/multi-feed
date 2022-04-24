const connectStatusDiv = document.getElementById("connect-attempt-success");

export function changeConnected(state) {
	if (!state.isConnected) {
		state.isConnected = false;
		connectStatusDiv.classList.remove("is-success");
		connectStatusDiv.classList.add("is-danger");
		connectStatusDiv.innerText = "Enter a username and please wait as socket gets connected ...";
	} else {
		state.isConnected = true;
		connectStatusDiv.classList.remove("is-danger");
		connectStatusDiv.classList.add("is-success");
		connectStatusDiv.innerText = "Connected!";
	}
}

const submitResetInput = document.getElementById("submit-reset");
const usernameInput = document.getElementById("username-input");
const textContent = document.getElementById("text-content");
const sendButton = document.getElementById("send-button");

export function changeInputDisplay(state) {
	if (state.username.length === 0) {
		submitResetInput.innerText = "Submit";
		usernameInput.removeAttribute("disabled");
		usernameInput.value = "";
		textContent.setAttribute("disabled", "");
		sendButton.setAttribute("disabled", "");
	} else {
		submitResetInput.innerText = "Disconnect";
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
    <article class="tile is-child notification is-info">
      <p class="title">${author}</p>
      <p class="subtitle">
	  	<pre class="is-family-secondary is-size-4" style="background-color: inherit;">${text}</pre>
	  </p>
    </article>
  </div>
  `;

	messagesContainer.appendChild(child);
}
