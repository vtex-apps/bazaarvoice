export class GraphQLExtensionError extends Error {
    constructor(message: any, public statusCode? , public extensions?) {
      super(message);
    }
}
  