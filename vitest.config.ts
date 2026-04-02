import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import path from 'path'

export default mergeConfig(
    viteConfig,
    defineConfig({
        plugins: [
            ViteFonts({
                fontsource: {
                    families: [
                        {
                            name: 'Roboto',
                            weights: [100, 300, 400, 500, 700, 900],
                            styles: ['normal', 'italic']
                        }
                    ]
                }
            })
        ],
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
function ViteFonts(arg0: {
    fontsource: { families: { name: string; weights: number[]; styles: string[] }[] }
}): import('vite').PluginOption {
    throw new Error('Function not implemented.')
}
