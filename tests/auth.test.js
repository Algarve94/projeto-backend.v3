const request = require("supertest");
const app = require("../server");

// Dados reutilizados nos testes
const usuarioValido = {
  nome: "João Silva",
  email: "joao@email.com",
  senha: "senha123",
  idade: 28,
};

// ── /auth/registrar ───────────────────────────────────────────────
describe("POST /auth/registrar", () => {
  it("deve registrar um novo usuário e retornar token", async () => {
    const res = await request(app).post("/auth/registrar").send(usuarioValido);
    console.log("ERRO:", res.body); // ← ADICIONE ESTA LINHA
    expect(res.statusCode).toBe(201);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.dados.email).toBe(usuarioValido.email);
  });

  it("deve rejeitar e-mail duplicado", async () => {
    await request(app).post("/auth/registrar").send(usuarioValido);
    const res = await request(app).post("/auth/registrar").send(usuarioValido);

    expect(res.statusCode).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });

  it("deve rejeitar dados inválidos (email mal formatado)", async () => {
    const res = await request(app)
      .post("/auth/registrar")
      .send({ ...usuarioValido, email: "email-invalido" });

    expect(res.statusCode).toBe(422);
    expect(res.body.erros).toBeDefined();
  });

  it("deve rejeitar senha com menos de 6 caracteres", async () => {
    const res = await request(app)
      .post("/auth/registrar")
      .send({ ...usuarioValido, senha: "123" });

    expect(res.statusCode).toBe(422);
  });
});

// ── /auth/login ───────────────────────────────────────────────────
describe("POST /auth/login", () => {
  beforeEach(async () => {
    // Garante que o usuário existe antes dos testes de login
    await request(app).post("/auth/registrar").send(usuarioValido);
  });

  it("deve fazer login com credenciais corretas", async () => {
    const res = await request(app).post("/auth/login").send({
      email: usuarioValido.email,
      senha: usuarioValido.senha,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("deve rejeitar senha incorreta", async () => {
    const res = await request(app).post("/auth/login").send({
      email: usuarioValido.email,
      senha: "senhaerrada",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.sucesso).toBe(false);
  });

  it("deve rejeitar e-mail não cadastrado", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "naoexiste@email.com",
      senha: "qualquer",
    });

    expect(res.statusCode).toBe(401);
  });
});

// ── /auth/me ──────────────────────────────────────────────────────
describe("GET /auth/me", () => {
  it("deve retornar perfil com token válido", async () => {
    const registro = await request(app).post("/auth/registrar").send(usuarioValido);
    const token = registro.body.token;

    const res = await request(app)
    .get("/auth/me")
    .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.dados.email).toBe(usuarioValido.email);
  });

  it("deve rejeitar acesso sem token", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.statusCode).toBe(401);
  });

// Teste adicional para verificar resposta detalhada  
  it("deve registrar um novo usuário e retornar token", async () => {
  const res = await request(app).post("/auth/registrar").send(usuarioValido);

  expect(res.statusCode).toBe(201);
  // ...
});

});
