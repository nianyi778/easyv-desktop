import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './samples/node-api'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme, Spin } from 'antd';
import zh_CN from 'antd/locale/zh_CN'
import { routers } from '@/router/index';
import {
  RecoilRoot,
} from 'recoil';
import { RecoilDevTools } from 'recoil-gear';
import _ from 'lodash';
window._ = _;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={zh_CN} theme={{
      algorithm: theme.darkAlgorithm,
    }}>
      <RecoilRoot>
        <RecoilDevTools />
        <Suspense fallback={<Spin />}>
          <RouterProvider router={routers} fallbackElement={<Spin />} />
        </Suspense>
      </RecoilRoot>
    </ConfigProvider>
  </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
