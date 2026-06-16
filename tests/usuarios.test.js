const request = require("supertest");
const app = require("../server");

const usuarioBase = {
  nome: "Maria Souza",
  email: "maria@email.com",
  senha: "senha123",
  idade: 30,
};

// Helper: registra e retorna o token JWT
const registrarEObterToken = async (dados = usuarioBase) => {
  const res = await request(app).post("/auth/registrar").send(dados);
  return res.body.token;
};

// ── GET /usuarios ─────────────────────────────────────────────────
describe("GET /usuarios", () => {
  it("deve listar usuários com paginação", async () => {
    const token = await registrarEObterToken();

    const res = await request(app)
      .get("/usuarios")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.paginacao).toBeDefined();
    expect(Array.isArray(res.body.dados)).toBe(true);
  });

  it("deve bloquear acesso sem token", async () => {
    const res = await request(app).get("/usuarios");
    expect(res.statusCode).toBe(401);
  });

  it("deve filtrar usuários por nome", async () => {
    const token = await registrarEObterToken();

    const res = await request(app)
      .get("/usuarios?nome=Maria")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.dados.length).toBeGreaterThan(0);
  });
});

// ── GET /usuarios/:id ─────────────────────────────────────────────
describe("GET /usuarios/:id", () => {
  it("deve buscar usuário por ID", async () => {
    const resRegistro = await request(app).post("/auth/registrar").send(usuarioBase);
    const token = resRegistro.body.token;
    const id = resRegistro.body.dados.id;

    const res = await request(app)
      .get(`/usuarios/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.dados.email).toBe(usuarioBase.email);
  });

  it("deve retornar 404 para ID inexistente", async () => {
    const token = await registrarEObterToken();

    const res = await request(app)
      .get("/usuarios/664000000000000000000000")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});

// ── PUT /usuarios/:id ─────────────────────────────────────────────
describe("PUT /usuarios/:id", () => {
  it("deve atualizar nome do usuário", async () => {
    const resRegistro = await request(app).post("/auth/registrar").send(usuarioBase);
    const token = resRegistro.body.token;
    const id = resRegistro.body.dados.id;

    const res = await request(app)
      .put(`/usuarios/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Maria Atualizada" });

    expect(res.statusCode).toBe(200);
    expect(res.body.dados.nome).toBe("Maria Atualizada");
  });
});

// ── DELETE /usuarios/:id ──────────────────────────────────────────
describe("DELETE /usuarios/:id", () => {
  it("deve desativar usuário (soft delete)", async () => {
    const resRegistro = await request(app).post("/auth/registrar").send(usuarioBase);
    const token = resRegistro.body.token;
    const id = resRegistro.body.dados.id;

    const res = await request(app)
      .delete(`/usuarios/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.mensagem).toMatch(/desativado/i);
  });
});
