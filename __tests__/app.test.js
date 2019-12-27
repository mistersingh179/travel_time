const request = require('supertest')
const app = require('../app')
const { resetRequestCount } = require('../middlewares/rate_limit.js')

test('true is always true', () => {
  expect(true).toBe(true)
})

describe('we have rate limiting', () => {
  beforeEach(() => {
    resetRequestCount()
  })
  test('first request gives 200', (done) => {
    request(app).get('/ping').then(res => {
      expect(res.statusCode).toBe(200)
      done()
    })
  })
  test('first 5 requests gives 200', async () => {
    await request(app).get('/ping')
    await request(app).get('/ping')
    await request(app).get('/ping')
    await request(app).get('/ping')
    const res = await request(app).get('/ping')
    expect(res.statusCode).toBe(200)
  })

  test('6th call back to back, lead to rate limit issue', async () => {
    // eslint-disable-next-line no-return-await
    await request(app).get('/ping')
    await request(app).get('/ping')
    await request(app).get('/ping')
    await request(app).get('/ping')
    await request(app).get('/ping')
    const res = await request(app).get('/ping')
    expect(res.statusCode).toBe(429)
  })

  describe('we make 6 calls', () => {
    test('we get error on 6th call when made within a second', async (done) => {
      jest.resetModules()
      jest.useFakeTimers()
      const app = require('../app')
      await request(app).get('/ping')
      await request(app).get('/ping')
      await request(app).get('/ping')
      await request(app).get('/ping')
      await request(app).get('/ping')
      jest.advanceTimersByTime(500)
      const res = await request(app).get('/ping')
      expect(res.statusCode).toBe(429)
      done()
    })
    test('we dont get error on 6th call when made after a second', async (done) => {
      jest.resetModules()
      jest.useFakeTimers()
      const app = require('../app')
      await request(app).get('/ping')
      await request(app).get('/ping')
      await request(app).get('/ping')
      await request(app).get('/ping')
      await request(app).get('/ping')
      jest.advanceTimersByTime(1500)
      const res = await request(app).get('/ping')
      expect(res.statusCode).toBe(200)
      done()
    })
  })
})
