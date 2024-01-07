import { rmSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import vitePluginImp from 'vite-plugin-imp'
import pkg from './package.json'



// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync('dist-electron', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    base: './',
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      },
    },
    // optimizeDeps: {
    //   exclude: commonjsPackages,
    // },
    build: {
      rollupOptions: {
        external: ['lodash-es/default'],
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            '@primary-color': '#4377FE',//设置antd主题色
          },
        },
      }
    },
    plugins: [
      react(),
      vitePluginImp({
        libList: [
          {
            libName: "antd",
            style: (name) => {
              if (name === 'theme') {
                return ''
              }
              return `antd/es/${name}/style`;
            },
          },
        ],
      }),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: 'electron/main/index.ts',
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
            } else {
              options.startup()
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}).concat('lodash-es/default'),
              },
            },
          },
        },
        {
          entry: 'electron/preload/index.ts',
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
            // instead of restarting the entire Electron App.
            options.reload()
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        }
      ]),
      // Use Node.js API in the Renderer-process
      renderer(),
    ],

    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000', // 实际接口的地址
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''), // 去除 '/api' 前缀
    //     onProxyReq: (proxyReq, req, res) => {
    //       // 自定义处理请求的逻辑
    //       // 例如，将请求转发到本地文件夹下的文件
    //       if (req.url.startsWith('/api/static')) {
    //         const filePath = req.url.replace('/api/static', '/path/to/local/folder');
    //         proxyReq.path = filePath;
    //       }
    //     },
    //   },
    // },
    server: process.env.VSCODE_DEBUG && (() => {
      const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
      return {
        host: url.hostname,
        port: +url.port,
      }
    })(),
    clearScreen: false,
  }
})
