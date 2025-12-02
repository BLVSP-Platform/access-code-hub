import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"
import '@fontsource-variable/lexend-deca/index.css';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: "#6C5DCC" }, 
        secondary: { value: "rgba(108, 93, 204, 0.50)"},
        tertiary: { value: "rgba(108, 93, 204, 0.25)"},
      },
      fonts: {
        heading: { value: 'Lexend Deca Variable, sans-serif' },
        body: { value: 'Lexend Deca Variable, sans-serif' },
      },
    }
  },
})

export const system = createSystem(defaultConfig, config)