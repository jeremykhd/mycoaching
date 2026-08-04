import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import path from 'path'

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            exclude: [...configDefaults.exclude, 'e2e/**'],
            root: fileURLToPath(new URL('./', import.meta.url)),
            globals: true,
            setupFiles: ['./vitest.setup.ts'],
            deps: {
                inline: [/@vue/, /vue-demi/]
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        }
    })
)
