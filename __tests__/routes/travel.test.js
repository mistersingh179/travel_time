jest.setTimeout(200)
const debug = require('debug')('travel.test.js')
const request = require('supertest')
jest.resetModules()
const app = require('../../app')
jest.mock('../../middlewares/rate_limit')

describe('travel router', () => {
  describe('recommendation api endpoint', () => {
    const url = '/travel/recommendation'
    describe('does not have any parameters', () => {
      it('returns 422', async () => {
        const res = await request(app).get(url)
        expect(res.statusCode).toBe(422)
      })
    })
    describe('has source, destination, from and to dates', () => {
      let params = {}
      beforeEach(() => {
        params = {
          source: 'New York',
          destination: 'Las Vegas',
          departureDate: '2019-01-01 EST',
          returnDate: '2019-01-05 EST'
        }
        debug('params are set to: ', params)
      })
      it('does not return 422', async () => {
        const res = await request(app).get(url).query(params)
        expect(res.statusCode).not.toBe(422)
      })
      describe('destination is rainy', () => {
        beforeEach(() => {
          params.destination = 'RainyVille'
        })
        it('gives false as travel recommendation', async () => {
          const res = await request(app).get(url).query(params)
          expect(res.body.travel).toBe(false)
        })
      })
      describe('destination is sunny', () => {
        beforeEach(() => {
          params.destination = 'SunnyVille'
        })
        describe('travel dates include a holiday', () => {
          it('gives false as travel recommendation because departureDate is a holiday', async () => {
            params.departureDate = '2019-01-01 EST'
            params.returnDate = '2019-01-03 EST'
            const res = await request(app).get(url).query(params)
            expect(res.body.travel).toBe(true)
          })
          it('gives false as travel recommendation because returnDate is a holiday', async () => {
            params.departureDate = '2018-12-30 EST'
            params.returnDate = '2019-01-01 EST'
            const res = await request(app).get(url).query(params)
            expect(res.body.travel).toBe(false)
          })
          it('gives false as travel recommendation because date between departure and return is a holiday', async () => {
            params.departureDate = '2019-12-24 EST'
            params.returnDate = '2019-12-26 EST'
            const res = await request(app).get(url).query(params)
            expect(res.body.travel).toBe(false)
          })
        })
        describe('travel dates have no holidays', () => {
          beforeEach(() => {
            params.departureDate = '2019-01-15 EST'
            params.returnDate = '2019-01-16 EST'
          })
          it('gives true as travel recommendation', async () => {
            // /console.log('about to send: ', params)
            const res = await request(app).get(url).query(params)
            // console.log(res.statusCode)
            expect(res.body.travel).toBe(true)
          })
        })
      })
    })
  })
})
