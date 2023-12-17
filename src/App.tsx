import { Outlet } from 'react-router-dom'
import './App.css'
// import Header from './components/header';
import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react';

function App() {
  const [isRender, setRender] = useState(false);
  useEffect(() => {
    (async () => {
      const appData = await ipcRenderer.invoke('app-getPath', 'userData');
      if (appData) {
        setRender(true)
      }
      window.appConfig = {
        appDataPath: appData
      }
    })()
  }, [])


  if (!isRender) {
    return null;
  }

  return (
    <div className='h-screen w-screen'>
      {/* <Header></Header> */}
      <Outlet />
    </div>
  )
}

export default App