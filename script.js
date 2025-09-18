const userDialog = document.getElementById("user-dialog");
const deleteDialog = document.getElementById("delete-modal");
let users = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : [];
const userForm = document.getElementById("user-form");
const confirmDelete = document.getElementById("confirm-delete");
let errors = [];
let editAtive = null;
function openUserDialog(id) {
    const found = users.find((user) => user.id === id);
    if (id) {
        document.querySelector("#name").value = found.name;
        document.querySelector("#email").value = found.email;
        document.querySelector("#phone").value = found.phone;
        document.querySelector("#submit-btn").textContent = "Cập Nhật Người Dùng";
        document.querySelector("#dialog-title").textContent = "Cập nhật người dùng";
        editAtive = id;
    } else {
        document.querySelector("#dialog-title").textContent = "Thêm mới người dùng";
        document.querySelector("#submit-btn").textContent = "Thêm Người Dùng";
    }
    userDialog.show();
}
function closeUserDialog() {
    userDialog.close();
    userForm.reset();
}
function closeDeleteModal() {
    deleteDialog.close();
}
function deleteUser(id) {
    userDelete = id;
    deleteDialog.show();
}
// xử lý sự kiện click outside -> close dialog userDialog
userDialog.addEventListener("click", (e) => {
    if (e.target === userDialog) {
        closeUserDialog();
    }
});
function validated(name, phone) {
    errors = [];
    const nameError = document.getElementById("name-error");
    const phoneError = document.getElementById("phone-error");
    nameError.textContent = "";
    phoneError.textContent = "";
    if (name.length < 2) {
        nameError.textContent = "Tên phải ≥ 2 ký tự";
        errors.push("name");
    }
    if (phone.length < 10 || phone.length > 11) {
        phoneError.textContent = "SĐT phải 10-11 chữ số";
        errors.push("phone");
    }
}
confirmDelete.addEventListener("click", (e) => {
    e.preventDefault();
    users = users.filter((user) => user.id !== userDelete);
    saveUsers();
    renderUsers();
    closeDeleteModal();
});
function saveUsers() {
    localStorage.setItem("user", JSON.stringify(users));
}
function renderUsers() {
    const userList = document.getElementById("users-grid");
    const emptyState = document.getElementById("empty-state");
    if (users.length === 0) {
        userList.innerHTML = "";
        emptyState.innerHTML = " <h3>Chưa có người dùng nào</h3><p>Hãy thêm người dùng đầu tiên của bạn!</p>";
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
        userList.innerHTML = users
            .map(
                (user) => `<div class="user-card">
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>
            <p>Phone: ${user.phone}</p>
            <div class="user-actions">
            <button class="btn btn-primary" onclick="openUserDialog('${user.id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
            </div>
            </div>`
            )
            .join("");
    }
}
renderUsers();
userDialog.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    validated(name, phone);
    console.log(errors);
    if (errors.length > 0) {
        return;
    } else {
        if (userForm.querySelector("#submit-btn").textContent === "Cập Nhật Người Dùng") {
            const found = users.findIndex((user) => user.id === editAtive);
            users[found] = { ...users[found], name, email, phone };
            saveUsers();
            renderUsers();
            closeUserDialog();
            return;
        }
        const user = {
            id: Date.now().toString(),
            name,
            email,
            phone,
        };
        users.push(user);
        saveUsers();
        renderUsers();
        userForm.reset();
        closeUserDialog();
    }
});

window.addEventListener("storage", (e) => {
    if (e.key === "user") {
        users = JSON.parse(e.newValue);
        renderUsers();
    }
});
