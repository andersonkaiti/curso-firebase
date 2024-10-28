import { app } from "./firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInAnonymously,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  // setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
} from "firebase/auth";
// https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js

const authEmailPassButton = document.getElementById("authEmailPassButton");
const authGoogleButton = document.getElementById("authGoogleButton");
const authGitHubButton = document.getElementById("authGitHubButton");
const authAnonymouslyButton = document.getElementById("authAnonymouslyButton");
const createUserButton = document.getElementById("createUserButton");
const logOutButton = document.getElementById("logOutButton");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const displayName = document.getElementById("displayName");

const auth = getAuth(app);

// Cria uma conta com base no e-mail e senha inseridos no formulário
const createAccountWithEmailAndPassword = async () => {
  try {
    await createUserWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );

    console.log(`Bem-vindo, ${emailInput.value}!`);
  } catch (error) {
    console.error(error);
    console.error("Falha ao cadastrar.");
  }
};

// Cria novo usuário
createUserButton.addEventListener("click", createAccountWithEmailAndPassword);

// Autentica o usuário com base no e-mail e senha inseridos no formulário
const authenticateUser = async () => {
  try {
    // await setPersistence(auth, browserSessionPersistence);
    const result = await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );

    displayName.innerText = `Bem-vindo, ${emailInput.value}`;
    console.log(result);
  } catch (error) {
    console.error(error);
    console.error("Falha ao autenticar");
  }
};

// Autenticar usuário
authEmailPassButton.addEventListener("click", authenticateUser);

// Desloga o usuário
logOutButton.addEventListener("click", async () => {
  await signOut(auth);
  location.reload();
});

const authenticateAnonymously = async () => {
  try {
    const result = await signInAnonymously(auth);
    displayName.innerText = "Bem-vindo, desconhecido";
    console.log("Autenticado como anônimo");
    console.log(result);
  } catch (error) {
    console.error(error);
    console.error("Falha ao autenticar.");
  }
};

authAnonymouslyButton.addEventListener("click", authenticateAnonymously);

const signIn = async (provider) => {
  try {
    // await setPersistence(auth, browserSessionPersistence);
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    displayName.innerText = `Bem-vindo, ${result.user.displayName}`;
  } catch (error) {
    console.error(error);
    console.log("Falha na autenticação");
  }
};

// https://github.com/settings/applications
authGitHubButton.addEventListener("click", () => {
  const provider = new GithubAuthProvider();
  signIn(provider);
});

authGoogleButton.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signIn(provider);
});

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      displayName.innerText = `Bem-vindo, ${user.displayName}`;
    } else {
      console.error("Falha na autenticação");
    }
  });
});
