export class GraphQLError extends Error {
  constructor(message: string, public errorCode: number, public details?: any) {
    // TODO: implementar error code e details
    super(message)
  }
}
