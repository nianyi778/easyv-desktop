import { useRouteError } from 'react-router-dom';
import { Button, Space } from 'antd';

export default function ErrorBoundary() {
  const error = useRouteError() as any;
  console.error(error);
  return (
    <div className=" flex items-center justify-center flex-col ">
      <span>
        系统异常错误：
        {error.message}
        <br />
        <span className=" text-[10px] text-neutral-400">详细错误见控制台（需提前打开控制台）</span>
      </span>
      <Space>
        <Button type="default" onClick={() => window.location.reload()}>
          手动刷新
        </Button>
        <Button
          type="primary"
          onClick={() => {
            window.location.href = '/';
          }}>
          返回首页
        </Button>
      </Space>
    </div>
  );
}
