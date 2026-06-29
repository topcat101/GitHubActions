const request = require('supertest');
const app = require('../src/server');

describe('GET /', () => {
  it('should return welcome message', async () => {
    const res = await request(app)
      .get('/')
      .expect(200);
    
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('OK');
  });
});

describe('GET /api/hello', () => {
  it('should return hello message', async () => {
    const res = await request(app)
      .get('/api/hello')
      .expect(200);
    
    expect(res.body.message).toBe('Hello, World!');
  });

  it('should return hello with custom name', async () => {
    const res = await request(app)
      .get('/api/hello?name=Alice')
      .expect(200);
    
    expect(res.body.message).toBe('Hello, Alice!');
  });
});

describe('GET /api/status', () => {
  it('should return health status', async () => {
    const res = await request(app)
      .get('/api/status')
      .expect(200);
    
    expect(res.body.status).toBe('healthy');
    expect(res.body).toHaveProperty('uptime');
  });
});

describe('POST /api/data', () => {
  it('should accept data and return uppercase', async () => {
    const res = await request(app)
      .post('/api/data')
      .send({ text: 'hello' })
      .expect(200);
    
    expect(res.body.uppercase).toBe('HELLO');
    expect(res.body.length).toBe(5);
  });

  it('should return 400 if text is missing', async () => {
    const res = await request(app)
      .post('/api/data')
      .send({})
      .expect(400);
    
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /health', () => {
  it('should return health check', async () => {
    const res = await request(app)
      .get('/health')
      .expect(200);
    
    expect(res.body.status).toBe('OK');
  });
});

describe('404 handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app)
      .get('/unknown-route')
      .expect(404);
    
    expect(res.body).toHaveProperty('error');
  });
});
