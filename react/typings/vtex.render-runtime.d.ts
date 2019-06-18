declare module 'vtex.render-runtime' {
  export const useRuntime: () => {
    culture: {
      locale: string
    }
    query: {
      [key: string]: string
    }
  }
}