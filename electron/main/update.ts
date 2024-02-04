import { app, ipcMain } from 'electron'
import pkg, { UpdateDownloadedEvent, ProgressInfo } from 'electron-updater'
const { autoUpdater } = pkg

export function update(win: Electron.BrowserWindow) {
  // 当设置为 false 时，更新下载将通过 API 触发
  autoUpdater.autoDownload = false
  autoUpdater.disableWebInstaller = false
  autoUpdater.allowDowngrade = false

  // 开始检查更新
  autoUpdater.on('checking-for-update', function () { })
  // 更新可用
  autoUpdater.on('update-available', (arg) => {
    win.webContents.send('update-can-available', { update: true, version: app.getVersion(), newVersion: arg?.version })
  })
  // 更新不可用
  autoUpdater.on('update-not-available', (arg) => {
    win.webContents.send('update-can-available', { update: false, version: app.getVersion(), newVersion: arg?.version })
  })

  // 检查更新
  ipcMain.handle('check-update', async () => {
    if (!app.isPackaged) {
      const error = new Error('The update feature is only available after the package.')
      return { message: error.message, error }
    }

    try {
      return await autoUpdater.checkForUpdatesAndNotify()
    } catch (error) {
      return { message: 'Network error', error }
    }
  })

  // 开始下载并反馈进度
  ipcMain.handle('start-download', (event) => {
    startDownload(
      (error, progressInfo) => {
        if (error) {
          // 反馈下载错误消息
          event.sender.send('update-error', { message: error.message, error })
        } else {
          // 反馈更新进度消息
          event.sender.send('download-progress', progressInfo)
        }
      },
      () => {
        // 反馈更新下载完成消息
        event.sender.send('update-downloaded')
      }
    )
  })

  // 立即安装
  ipcMain.handle('quit-and-install', () => {
    autoUpdater.quitAndInstall(false, true)
  })
}

function startDownload(
  callback: (error: Error | null, info: ProgressInfo | null) => void,
  complete: (event: UpdateDownloadedEvent) => void,
) {
  autoUpdater.on('download-progress', info => callback(null, info))
  autoUpdater.on('error', error => callback(error, null))
  autoUpdater.on('update-downloaded', complete)
  autoUpdater.downloadUpdate()
}