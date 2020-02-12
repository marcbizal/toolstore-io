import { parsePoints } from './points'

describe('parsePoints', () => {
  it('should parse an array of points', () => {
    const buffer = new Buffer('40a0000000000000c120000040a0000000000000c120000040a000000000000041700000', 'hex')

    const points = parsePoints(buffer)
    expect(points).to.deep.equal([
      { x: 5, y: 0, z: -10 },
      { x: 5, y: 0, z: -10 },
      { x: 5, y: 0, z: 15 },
    ])
  })

  it('should throw an error if the buffer cannot fit an even number of points', () => {
    const buffer = new Buffer('40a0000000000000', 'hex')

    expect(() => parsePoints(buffer)).to.throw(/does not evenly divide into chunk size/);
  })
})
