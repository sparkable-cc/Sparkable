import {
  getSparkBurst,
  SPARK_BURST_COLORS,
  SPARK_BURST_PIECE_MS,
  SPARK_BURST_PIECES,
  SPARK_BURST_TOTAL_MS,
} from './SparkBurst.shared'

describe('getSparkBurst', () => {
  it('plays for a new Spark after a tap, without an icon', () => {
    expect(
      getSparkBurst(
        {sparked: false, reaction: undefined},
        {sparked: true, reaction: null},
        true,
      ),
    ).toEqual({reaction: undefined})
  })

  it('plays with the icon when a reaction creates the Spark', () => {
    expect(
      getSparkBurst(
        {sparked: false, reaction: undefined},
        {sparked: true, reaction: 'hope'},
        true,
      ),
    ).toEqual({reaction: 'hope'})
  })

  it('plays with the new icon when the reaction changes', () => {
    expect(
      getSparkBurst(
        {sparked: true, reaction: 'hope'},
        {sparked: true, reaction: 'joy'},
        true,
      ),
    ).toEqual({reaction: 'joy'})
    // A reaction picked on a post that was already sparked when it loaded
    expect(
      getSparkBurst(
        {sparked: true, reaction: undefined},
        {sparked: true, reaction: 'insight'},
        false,
      ),
    ).toEqual({reaction: 'insight'})
  })

  it('stays quiet on page load and in other copies of the post', () => {
    expect(
      getSparkBurst(
        {sparked: false, reaction: undefined},
        {sparked: true, reaction: undefined},
        false,
      ),
    ).toBeUndefined()
    expect(
      getSparkBurst(
        {sparked: true, reaction: undefined},
        {sparked: true, reaction: undefined},
        false,
      ),
    ).toBeUndefined()
  })

  it('never plays when a Spark or reaction is removed', () => {
    expect(
      getSparkBurst(
        {sparked: true, reaction: 'hope'},
        {sparked: false, reaction: null},
        true,
      ),
    ).toBeUndefined()
    expect(
      getSparkBurst(
        {sparked: true, reaction: 'hope'},
        {sparked: true, reaction: null},
        true,
      ),
    ).toBeUndefined()
    expect(
      getSparkBurst(
        {sparked: true, reaction: null},
        {sparked: false, reaction: null},
        true,
      ),
    ).toBeUndefined()
  })
})

describe('burst constants', () => {
  it('uses the three brand colors', () => {
    expect(SPARK_BURST_COLORS).toEqual(['#4153f5', '#fa7ac4', '#cdf971'])
  })

  it('has ten pieces within the spec', () => {
    expect(SPARK_BURST_PIECES).toHaveLength(10)
    expect(new Set(SPARK_BURST_PIECES.map(piece => piece.shape))).toEqual(
      new Set(['strip', 'dot']),
    )
    for (const piece of SPARK_BURST_PIECES) {
      expect(-piece.dy).toBeGreaterThanOrEqual(15)
      expect(-piece.dy).toBeLessThanOrEqual(45)
      expect(Math.abs(piece.dx)).toBeLessThanOrEqual(45)
      expect(Math.abs(piece.rotate)).toBeGreaterThanOrEqual(90)
      expect(Math.abs(piece.rotate)).toBeLessThanOrEqual(200)
      expect(piece.delay).toBeLessThanOrEqual(80)
    }
  })

  it('finishes in under a second', () => {
    const longest = Math.max(
      ...SPARK_BURST_PIECES.map(piece => piece.delay + SPARK_BURST_PIECE_MS),
    )
    expect(longest).toBeLessThanOrEqual(SPARK_BURST_TOTAL_MS)
    expect(SPARK_BURST_TOTAL_MS).toBeLessThan(1000)
  })
})
