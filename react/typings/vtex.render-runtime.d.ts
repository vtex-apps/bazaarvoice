declare module 'vtex.render-runtime' {
  export const useRuntime: () => {
    culture: {
      locale: string
    }
    navigate: (params?: Record<string, unknown>) => void
    query: {
      [key: string]: string
    }
  }

  export const Link
  export const canUseDOM: boolean
}
