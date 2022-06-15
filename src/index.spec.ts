import { it, expect, describe } from 'vitest'
import { graphQLQueryToJson } from './index'

describe('graphQLQueryToJson', () => {
  it('should parse a query with one field', () => {
    // Arrange
    const mockQuery = /* GraphQL */ `
			{
				hero {
					name
				}
			}
		`

    // Act
    const res = graphQLQueryToJson(mockQuery)

    // Assert
    expect(res).toMatchInlineSnapshot(`
      {
        "hero": {
          "name": true,
        },
      }
    `)
  })

  it('should parse a query with a comment', () => {
    // Arrange
    const mockQuery = /* GraphQL */ `
			{
				hero {
					name
					# Queries can have comments!
					friends {
						name
					}
				}
			}
		`

    // Act
    const res = graphQLQueryToJson(mockQuery)

    // Assert
    expect(res).toMatchInlineSnapshot(`
      {
        "hero": {
          "friends": {
            "name": true,
          },
          "name": true,
        },
      }
    `)
  })

  it('should parse a query with an argument', () => {
    // Arrange
    const mockQuery = /* GraphQL */ `
			{
				human(id: "1000") {
					name
					height
				}
			}
		`

    // Act
    const res = graphQLQueryToJson(mockQuery)

    // Assert
    expect(res).toMatchInlineSnapshot(`
      {
        "human": {
          "height": true,
          "name": true,
        },
      }
    `)
  })

  it('should parse a query with nested arguments', () => {
    // Arrange
    const mockQuery = /* GraphQL */ `
			{
				human(id: "1000") {
					name
					height(unit: FOOT)
				}
			}
		`

    // Act
    const res = graphQLQueryToJson(mockQuery)

    // Assert
    expect(res).toMatchInlineSnapshot(`
      {
        "human": {
          "height": true,
          "name": true,
        },
      }
    `)
  })

  it('should parse a query with aliases', () => {
    // Arrange
    const mockQuery = /* GraphQL */ `
			{
				empireHero: hero(episode: EMPIRE) {
					name
				}
				jediHero: hero(episode: JEDI) {
					name
				}
			}
		`

    // Act
    const res = graphQLQueryToJson(mockQuery)

    // Assert
    expect(res).toMatchInlineSnapshot(`
      {
        "hero": {
          "name": true,
        },
      }
    `)
  })

  it('should parse a query with the operation name', () => {
    // Arrange
    const mockQuery = /* GraphQL */ `
			query HeroNameAndFriends {
				hero {
					name
					friends {
						name
					}
				}
			}
		`

    // Act
    const res = graphQLQueryToJson(mockQuery)

    // Assert
    expect(res).toMatchInlineSnapshot(`
      {
        "hero": {
          "friends": {
            "name": true,
          },
          "name": true,
        },
      }
    `)
  })

  it('should parse a query with variables', () => {
    // Arrange
    const mockQuery = /* GraphQL */ `
			query HeroNameAndFriends($episode: Episode) {
				hero(episode: $episode) {
					name
					friends {
						name
					}
				}
			}
		`

    // Act
    const res = graphQLQueryToJson(mockQuery)

    // Assert
    expect(res).toMatchInlineSnapshot(`
      {
        "hero": {
          "friends": {
            "name": true,
          },
          "name": true,
        },
      }
    `)
  })

  it('should parse a query with variables with defaults', () => {
    // Arrange
    const mockQuery = /* GraphQL */ `
			query HeroNameAndFriends($episode: Episode = JEDI) {
				hero(episode: $episode) {
					name
					friends {
						name
					}
				}
			}
		`

    // Act
    const res = graphQLQueryToJson(mockQuery)

    // Assert
    expect(res).toMatchInlineSnapshot(`
      {
        "hero": {
          "friends": {
            "name": true,
          },
          "name": true,
        },
      }
    `)
  })

  it('should parse a query with directives', () => {
    // Arrange
    const mockQuery = /* GraphQL */ `
			query Hero($withFriends: Boolean!) {
				hero(episode: $episode) {
					name
					friends @include(if: $withFriends) {
						name
					}
				}
			}
		`

    // Act
    const res = graphQLQueryToJson(mockQuery)

    // Assert
    expect(res).toMatchInlineSnapshot(`
      {
        "hero": {
          "friends": {
            "name": true,
          },
          "name": true,
        },
      }
    `)
  })

  it('should parse a mutation', () => {
    // Arrange
    const mockQuery = /* GraphQL */ `
			mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
				createReview(episode: $ep, review: $review) {
					stars
					commentary
				}
			}
		`

    // Act
    const res = graphQLQueryToJson(mockQuery)

    // Assert
    expect(res).toMatchInlineSnapshot(`
      {
        "createReview": {
          "commentary": true,
          "stars": true,
        },
      }
    `)
  })

  it('should not be able to parse fragments', () => {
    // Arrange
    const mockQuery = /* GraphQL */ `
			fragment comparisonFields on Character {
				name
				friendsConnection(first: $first) {
					totalCount
					edges {
						node {
							name
						}
					}
				}
			}

			query HeroComparison($first: Int = 3) {
				leftComparison: hero(episode: EMPIRE) {
					...comparisonFields
				}
				rightComparison: hero(episode: JEDI) {
					...comparisonFields
				}
			}

		`

    // Act
    // const res = graphQLQueryToJson(mockQuery)

    // Assert
    expect(() => graphQLQueryToJson(mockQuery)).toThrow()
  })

  it('should parse inline fragments', () => {
    // Arrange
    const mockQuery = /* GraphQL */ `
			query HeroForEpisode($ep: Episode!) {
				hero(episode: $ep) {
					name
					... on Droid {
						primaryFunction
					}
					... on Human {
						height
					}
				}
			}
		`

    // Act
    const res = graphQLQueryToJson(mockQuery)

    // Assert
    expect(res).toMatchInlineSnapshot(`
      {
        "hero": {
          "height": true,
          "name": true,
          "primaryFunction": true,
        },
      }
    `)
  })
})
