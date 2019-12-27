jest.mock('weather-js')

const getTheWeather = require('../foo')

describe('getTheWeather', () => {
  test('getTheWeather is there', () => {
    expect(getTheWeather).not.toBe(undefined)
  })

  test('returns the weather for new york', async () => {
    const answer = await getTheWeather('New York')
    expect(answer).not.toBeUndefined()
    expect(answer).toEqual(expect.anything())
    expect(answer).toEqual(expect.any(String))
    expect(answer).toBeTruthy()
  })

  test('throws error for a non existent place', async () => {
    try {
      const result = await getTheWeather('!@#@!#@!')
      console.log('result:', result)
    } catch (e) {
      expect(e).toEqual(expect.any(Error))
    }
  })

  it('says rainy for rainyville', async () => {
    const answer = await getTheWeather('RainyVille')
    expect(answer).toMatch('Rainy')
  })

  it('says sunny for sunnyville', async () => {
    const answer = await getTheWeather('SunnyVille')
    expect(answer).toMatch('Sunny')
  })
})
