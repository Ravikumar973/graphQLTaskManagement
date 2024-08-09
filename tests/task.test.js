const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

describe('Task API', () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a new task', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            addTask(title: "Test Task", description: "Task Description", status: "Pending", userId: "some-user-id") {
              id
              title
              description
            }
          }
        `,
      });
    expect(response.status).toBe(200);
    expect(response.body.data.addTask.title).toBe('Test Task');
  });

  // Add more test cases as needed
});
