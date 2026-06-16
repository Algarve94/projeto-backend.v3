const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

// Roda UMA VEZ antes de todos os testes
beforeAll(async () => {
  await mongoose.disconnect();
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Limpa as coleções entre cada teste (isolamento)
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Roda UMA VEZ após todos os testes
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
