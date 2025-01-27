import { app, BrowserWindow, shell, ipcMain, Menu, MenuItemConstructorOptions } from 'electron'
import { release } from 'node:os'
import { update } from './update'
import { mainInitHand } from './dbServices/dbServicesInit'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.mjs')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

const webPreferencesConfig = {
  preload,
  nodeIntegration: true,
  contextIsolation: true, // 禁用安全策略
  webSecurity: false, // 禁用同源策略
}

async function createWindow() {
  win = new BrowserWindow({
    title: 'EasyV',
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: webPreferencesConfig,
  })

  if (url) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    // prod
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Apply electron-updater
  update(win)
}


app.whenReady().then(() => {
  createWindow();
  mainInitHand()
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})
app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: webPreferencesConfig,
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})



const isMac = process.platform === 'darwin'
const template: MenuItemConstructorOptions[] = [
  {
    label: 'EasyV 运行平台',
    submenu: [
      {
        role: 'about',
        label: '关于' + app.name,
      },
      {
        label: '检查更新...',
        click: () => {
          // 处理打开文件的逻辑
        }
      },
      { type: 'separator' },
      { role: 'hide', label: '隐藏' + app.name },
      { role: 'hideOthers', label: "隐藏其他" },
      { type: 'separator' },
      { role: 'quit', label: '退出' + app.name }
    ]
  },
  {
    label: "工具",
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: isMac ? 'CmdOrCtrl+Alt+I' : 'Ctrl+Shift+I',
        click: () => {
          // 处理点击事件
          if (win) {
            win.webContents.toggleDevTools();
          }
        }
      }
    ]
  },
  {
    role: 'help',
    label: "帮助",
    submenu: [
      {
        label: '帮助与客服',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://easyv.cloud/help')
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);