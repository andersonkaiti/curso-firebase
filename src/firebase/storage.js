import { app } from "./firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  getDatabase,
  ref as databaseRef,
  onValue,
  push,
} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js

const uploader = document.getElementById("uploader");
const fileButton = document.getElementById("fileButton");
const images = document.getElementById("images");

const storage = getStorage(app);

const database = getDatabase(app);
const imagesRef = databaseRef(database, "images");

const auth = getAuth(app);

async function pushImage(storageRef) {
  try {
    const url = await getDownloadURL(storageRef);
    push(imagesRef, { url });
  } catch (error) {
    console.error(error);
  }
}

fileButton.addEventListener("change", ({ target }) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Obtém o arquivo
      const file = target.files[0];

      // Referencia o Storage
      const storageRef = ref(storage, `arquivos/${file.name}`);

      // Envia o arquivo. Caso seja necessário apenas enviar o arquivo, a variável task não é necessária, mas como existe o Progress Bar, ela é necessária
      const task = uploadBytesResumable(storageRef, file);

      // Atualiza a Progress Bar
      task.on(
        "state_changed",
        function progress(snapshot) {
          const percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          uploader.style.width = `${percentage}%`;
          uploader.setAttribute("aria-valuenow", progress);
        },
        function error(error) {
          console.error(error);
        },
        async function complete() {
          await pushImage(storageRef);
          alert("Envio completo!");
        }
      );
    } else {
      alert("Você precisa estar autenticado para criar um registro!");
    }
  });
});

onValue(imagesRef, (snapshot) => {
  images.innerHTML = "";
  snapshot.forEach((image) => {
    const img = document.createElement("img");
    img.src = image.val().url;
    img.className = "w-25";
    images.appendChild(img);
  });
});
