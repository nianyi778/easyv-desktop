import React, { Component } from 'react';
import { isEqual } from 'lodash-es';

interface IProps {
  id: number | string;
  data: any;
  children: React.ReactNode;
}

interface IState {
  hasError: boolean;
}

export default class ComErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps | Readonly<IProps>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.log(`组件发生错误（id:${this.props.id}）:`, error);
  }

  componentDidUpdate(prevProps: { data: any; }) {
    const { data: prevData } = prevProps;

    if (!isEqual(prevData, this.props.data) && this.state.hasError) {
      this.setState({
        hasError: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
