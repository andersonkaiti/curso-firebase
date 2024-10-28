# Introdução ao Firebase

# O que é um BaaS?

`BaaS` significa `Back-end as a Service` e fornece um back-end completo para a aplicação, permitindo focar no front-end. Ele deriva do SaaS (Software as a Service) e é utilizado como um serviço, ou seja, funciona como uma plataforma pronta para uso e que `abstrai tudo o que vem depois da camada de apresentação`.

Dentro das abstrações está a `segurança da aplicação`, além da `infraestrutura`. É claro que nem tudo é 100%, mas a segurança de um ambiente OnCloud é mais reforçado que um ambiente OnPremise (servidor físico).

Provê:

- Host.
- Storage.
- URL e endpoint.
- Seriço REST.

# O que é o Firebase?

O Firebase é um `BaaS disponível apenas on-line` (não é possível baixar e utilizar localmente), criada pela Google, e que funciona a partir da URL `firebase.google.com`.

Ele fornece o seguinte:

- Autenticação.
- Real-Time Database.
- Storage.
- Notification.
- Hosting.

# Prós e Contras

## Prós

- `Economia de Tempo:` já fornece tudo pronto, como API REST, autenticação, upload de arquivos, host etc.
- `Isenção de responsabilidade:` muitas das vezes o programador precisa saber um pouco de tudo, como Cloud, infraestrutura etc. Com o Firebase, o desenvolvedor não é responsável por ataques, invasões etc., mas sim a Google.
- `Redução de Custos.`
- `Alta disponibilidade:` a aplicação não cai. No Azure, por exemplo, ao subir uma aplicação ela é replicada em mais dois servidores, então se o primeiro falhar, o segundo já está em ação. Caso a aplicação seja de vendas, por exemplo, a aplicação cai durante um pico de usuário, haveria perda de dinheiro.

## Contras

- `Customizável, mas nem tanto:` se houver muitas regras de negócio, dificilmente é possível migrar um ERP para um BaaS.
- `É necessário se adequar a ele.`
- `Dificuldade em cenários OnPremise:` como o Firebase está na nuvem, a ideia pode não ser bem aceita, pois podem preferir localmente.

# Acesso ao Firebase

Para acessar a documentação, seção de preços e anúncios de funcionalidades novas, basta acessar o [firebase.google.com](https://firebase.google.com), e, para utilizar os serviços, basta acessar o [console.firebase.google.com](https://console.firebase.google.com).

# REST e CRUD

O Firebase no `armazenamento de dados trabalha no formato NoSQL`, e não com dados relacionais, e armazena documentos então os dados são adicionados ao banco no formato JSON, em coleções, versionando-os. Para manipular os dados, o Real-Time Database fornece métodos CRUD.

Para utilizar o Real-Time Database, basta realizar um `POST na URL` para salvar os dados da seguinte forma: `https://APP.firebaseio.com/COLEÇÂO.json`. Ao criar uma aplicação, o Firebase cria um `prefixo para a URL (um sub-domínio)` e tudo o que vier `depois da última barra ele tratará como coleção`, sendo necessário colocar a extensão `.json` no final para o Firebase perceber que o POST está `adicionando uma coleção`. O mesmo vale para os métodos GET, PUT e DELETE, com a mesma URL.

Ao adicionar um dado, o Firebase sempre `gera um ID automaticamente`, além disso, é possível adicionar `qualquer tipo de informação` ou um `JSON totalmente diferente do anterior`.

# Regras

Para realizar requisições ao banco de dados e outros serviços do Firebase, é necessário `configurar as regras de acesso`. É possível `impedir` a operação read (leitura) ou write (escrita) adicionando o valor `false`, `permitir` as operações com `true` e permitir elas apenas quando o usuário estiver `autenticado` com `"auth != null"`.

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": true
  },
  "clientes": {
    ".read": true,
    ".write": false
  }
}
```

# Fazendo o POST

```
┌─────────┬──────────────────┐
│ Headers │ application/json │
└─────────┴──────────────────┘
```

```json
{
  "nome": "Peter",
  "sobrenome": "Parker"
}
```

# Fazendo o GET

```json
{
  "id": {
    "nome": "Peter",
    "sobrenome": "Parker"
  }
}
```

# Fazendo o PUT

```json
{
  "id": {
    "nome": "Peter da Silva",
    "sobrenome": "Parker"
  }
}
```

# Real-Time Database

Quando a aplicação, configurada, se conecta ao Firebase, ela mantém a conexão, permitindo que os dados sejam `trafegados em tempo real`. Tudo o que acontece no banco de dados é refletido na tela e no JavaScript, e tudo o que é feito na tela é passado para o JavaScript que passa para o banco de dados. O nome disso é `Three-Way Binding`.

## WebSockets

Toda vez que uma conexão é realizada com o servidor, não estamos conectados a ele. A aplicação conecta-se a ele, executa uma operação, retorna alguma informação para a página e a conexão é fechada. `Com Sockets, a conexão é realizada e se mantém`, tornando o tráfego muito mais rápido, pois todo o processo de abertura e fechamento de conexão é evitado, haja vista que a aplicação já está conectada.

## Snapshots

Uma `Snapshot` é como se fosse uma `fotografia do banco de dados`. Toda vez que um dado é `atualizado` ou `inserido`, ele `tira uma foto documento`.

```js
const firebase = initializeApp(firebaseConfig);

// O banco de dados é obtido a partir da função getDatabase
const database = getDatabase(firebase);

// É criada a referência da coleção "users"
const usersRef = ref(database, "users");

// A função create recebe os dados e realiza os push dele na coleção
function create(data) {
  return push(usersRef, data);
}

// Escuta por atualizações no banco e, caso haja, recebe uma snapshot, que é uma fotografia do banco de dados, e, com base nela, exibe os dados na tela
onValue(usersRef, (snapshot) => {
  usersList.innerHTML = "";
  snapshot.forEach((item) => {
    const li = document.createElement("li");
    li.appendChild(
      document.createTextNode(`${item.val().name} : ${item.val().age}`)
    );
    usersList.appendChild(li);
  });
});
```

# Authentication

```js
const firebase = initializeApp(firebaseConfig);

// A variável de autenticação é obtida a partir da função getAuth
const auth = getAuth(firebase);

// Cria uma conta com base no e-mail e senha inseridos no formulário
const createAccountWithEmailAndPassword = async () => {
  try {
    await createUserWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );
  } catch (error) {
    console.error("Falha ao cadastrar.");
  }
};

// Autentica o usuário com base no e-mail e senha inseridos no formulário
const authenticateUser = async () => {
  try {
    const result = await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );
  } catch (error) {
    console.error(error);
  }
};

// Desloga o usuário
logOutButton.addEventListener("click", async () => await signOut(auth));

const authenticateAnonymously = async () => {
  try {
    const result = await signInAnonymously(auth);
  } catch (error) {
    console.error(error);
  }
};

// Permite se cadastrar por meio de uma rede social com um pop-up que aparece na tela, basta fornecer o Provider da rede social
const signIn = async (provider) => {
  try {
    const result = await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
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
```

# Storage

```js
const firebase = initializeApp(firebaseConfig);

const storage = getStorage(firebase);

fileButton.addEventListener("change", ({ target }) => {
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
      uploader.value = percentage;
    },
    function error(error) {
      console.error(error);
    },
    function complete() {
      alert("Envio completo!");
    }
  );
});
```
