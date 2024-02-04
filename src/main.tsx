import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import RouterSpin from '@/components/RouterSpin';
import zh_CN from 'antd/locale/zh_CN'
import { routers } from '@/router/index';
import {
  RecoilRoot,
} from 'recoil';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={zh_CN} theme={{
      algorithm: theme.darkAlgorithm,
    }}>
      <RecoilRoot>
        {/* <RecoilDevTools /> */}
        <Suspense fallback={<RouterSpin />}>
          <RouterProvider router={routers} fallbackElement={<RouterSpin />} />
        </Suspense>
      </RecoilRoot>
    </ConfigProvider>
  </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
