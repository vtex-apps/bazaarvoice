declare module 'vtex.render-runtime' {
  export const useRuntime: () => {
    culture: {
      locale: string
    }
    navigate: (params?: object) => void
    query: {
      [key: string]: string
    }
  }

  export const Link
  export const canUseDOM: boolean
}
