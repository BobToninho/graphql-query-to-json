import { parse, visit } from 'graphql'
// @ts-expect-error No declaration file
import parseFields from 'graphql-parse-fields'

export function graphQLQueryToJson (query: string) : Record<string, boolean> {
  const ast = parse(query)

  let resObj = {}

  // https://graphql.org/graphql-js/language/#visit
  visit(ast, {
    enter (_, __, ___, ____, ancestors) {
      resObj = parseFields(ancestors)
      if (Object.keys(resObj).length !== 0) {
        return 'visitor.BREAK'
      }
      // @return
      //   undefined: no action
      //   false: skip visiting this node
      //   visitor.BREAK: stop visiting altogether
      //   null: delete this node
      //   any value: replace this node with the returned value
    }
  })

  return resObj
}
