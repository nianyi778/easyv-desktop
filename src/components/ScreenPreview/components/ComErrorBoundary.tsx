import React from "react";

class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  customErrorChildren: React.ReactNode;
}, {
  hasError: boolean;
}> {
  constructor(props: { children: React.ReactNode; customErrorChildren: React.ReactNode; } | Readonly<{ children: React.ReactNode; customErrorChildren: React.ReactNode; }>) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // 你同样可以将错误日志上报给服务器
    console.log(error, errorInfo);
    this.setState({
      hasError: true
    })
  }
  render() {
    const { hasError } = this.state;
    const { children, customErrorChildren } = this.props;

    if (hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return customErrorChildren
    }
    return children;
  }
}

export default ErrorBoundary;
