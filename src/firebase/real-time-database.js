import { app } from "./firebase";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js

const usersList = document.getElementById("usersList");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const addButton = document.getElementById("addButton");

const auth = getAuth(app);

addButton.addEventListener("click", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      create({ name: nameInput.value, age: ageInput.value });
    } else {
      alert("Você precisa estar autenticado para criar um registro!");
    }
  });
});

const database = getDatabase(app);

const usersRef = ref(database, "users");

function create(data) {
  return push(usersRef, data);
}

// Exibe os dados na tela mediante os snapshots, que são fotos do banco de dados, enviados
onValue(usersRef, (snapshot) => {
  usersList.innerHTML = "";
  snapshot.forEach((item) => {
    const li = document.createElement("li");
    li.setAttribute("class", "list-group-item");
    li.appendChild(
      document.createTextNode(
        `Nome: ${item.val().name}, idade: ${item.val().age}`
      )
    );
    usersList.appendChild(li);
  });
});
