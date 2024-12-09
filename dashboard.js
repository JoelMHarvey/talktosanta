const API_BASE = "http://localhost:3000"; // Update with your backend URL

// Fetch and display child profiles
async function fetchChildren() {
    const response = await fetch(`${API_BASE}/children`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const children = await response.json();
    const childList = document.getElementById("child-list");
    childList.innerHTML = children.map(child => `
        <div class="child">
            <div>
                <h3>${child.name} (${child.age} years old)</h3>
                <p>Interests: ${child.interests.join(", ")}</p>
                <p>Wishes: ${child.wishes.join(", ")}</p>
            </div>
            <div>
                <button onclick="editChild('${child._id}')">Edit</button>
                <button onclick="deleteChild('${child._id}')">Delete</button>
            </div>
        </div>
    `).join("");
}

// Open the add/edit form
function openAddForm() {
    document.getElementById("form-title").textContent = "Add New Profile";
    document.getElementById("child-form-section").style.display = "block";
}

// Close the form
function closeForm() {
    document.getElementById("child-form-section").style.display = "none";
}

// Save child profile (create or edit)
async function saveChild() {
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const interests = document.getElementById("interests").value.split(",");
    const wishes = document.getElementById("wishes").value.split(",");

    const response = await fetch(`${API_BASE}/children`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, age, interests, wishes }),
    });

    if (response.ok) {
        fetchChildren();
        closeForm();
    } else {
        alert("Error saving child profile");
    }
}

// Delete a child profile
async function deleteChild(id) {
    const response = await fetch(`${API_BASE}/children/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (response.ok) {
        fetchChildren();
    } else {
        alert("Error deleting child profile");
    }
}

// Initialize the dashboard
fetchChildren();