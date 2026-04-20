let selectedId = null;

function loadContacts() {
    fetch("/contacts")
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById("contactList");
            list.innerHTML = "";

            data.forEach(c => {
                const div = document.createElement("div");
                div.className = "contact";            

                div.innerText = c.first_name + " " + c.last_name;
                div.onclick = () => {
                    selectedId = c.id;
                    loadForm(c);

                    document.querySelectorAll(".contact").forEach(el => {
                        el.classList.remove("selected");
                    });
                    div.classList.add("selected");
                }
                list.appendChild(div);
            });
        });
}
function loadForm(contact) {
    selectedId = contact.id;
    document.getElementById("firstName").value = contact.first_name;
    document.getElementById("lastName").value = contact.last_name;

    const emailsDiv = document.getElementById("emails");
    emailsDiv.innerHTML = "";

    contact.emails.forEach(e => {
        addEmail(e);
    });
}
function newContact() {
    selectedId = null;
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("emails").innerHTML = "";
}
function addEmail(value = "") {
    
    const div = document.createElement("div");
    div.className = "email";

    const input = document.createElement("input");
    input.value = value;
    input.placeholder = "Email";

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "-";
    removeBtn.onclick = () => div.remove();
    removeBtn.className = "removeButton";

    div.appendChild(input);
    div.appendChild(removeBtn);

    document.getElementById("emails").appendChild(div);
}
function getEmails() {
    const inputs = document.querySelectorAll("#emails input");
    return Array.from(inputs).map(i => i.value);
}
function saveContact() {
   function saveContact() {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();

    if (!firstName || !lastName) {
        alert("First Name and Last Name are required!");
        return;
    }

    const data = {
        first_name: firstName,
        last_name: lastName,
        emails: getEmails()
    };

    if (selectedId) {
        fetch(`/contacts/${selectedId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(loadContacts);
    } else {
        fetch("/contacts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(loadContacts);
    }

    newContact();
}
}

function deleteContact() {
    if (!selectedId) return;

    fetch(`/contacts/${selectedId}`, {
        method: "DELETE"
    }).then(() => {
        newContact();
        loadContacts();
    });
}

function cancel() {
    newContact();
}

loadContacts();