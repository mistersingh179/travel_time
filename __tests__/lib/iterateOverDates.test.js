const moment = require('moment')
const iterateOverDates = require('../../lib/iterateOverDates')

describe('iterateOverDates', () => {
  test('the function exists', () => {
    expect(iterateOverDates).toBeDefined()
  })
  test('accepts 3 parameters', () => {
    expect(iterateOverDates.length).toBe(3)
  })

  describe('start date is 5 days before the end date', () => {
    let start
    let end
    beforeEach(() => {
      start = moment()
      end = moment().add(5, 'days')
    })
    it('calls the passed in callback function', () => {
      const cb = jest.fn()
      iterateOverDates(start, end, cb)
      expect(cb).toBeCalled()
    })
    test('callback is called 6 times, once for every day from start to end date', () => {
      const cb = jest.fn()
      iterateOverDates(start, end, cb)
      expect(cb.mock.calls.length).toEqual(6)
    })
    test('passes the date to callback object', () => {
      const cb = jest.fn()
      iterateOverDates(start, end, cb)
      expect(cb.mock.calls[0][0]).toEqual(start)
      expect(cb.mock.calls[1][0]).toEqual(start.clone().add(1, 'days'))
      expect(cb.mock.calls[2][0]).toEqual(start.clone().add(2, 'days'))
      expect(cb.mock.calls[3][0]).toEqual(start.clone().add(3, 'days'))
      expect(cb.mock.calls[4][0]).toEqual(start.clone().add(4, 'days'))
      expect(cb.mock.calls[5][0]).toEqual(start.clone().add(5, 'days'))
    })
  })

  describe('start date is after end date', () => {
    let start
    let end
    beforeEach(() => {
      start = moment()
      end = moment().subtract(5, 'days')
    })
    it('does not call the passed in callback function', () => {
      const cb = jest.fn()
      iterateOverDates(start, end, cb)
      expect(cb).not.toBeCalled()
    })
  })
})
