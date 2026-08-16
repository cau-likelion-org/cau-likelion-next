import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

import { BackgroundWhite, Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { captureError } from 'src/lib/errorReporter';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// 렌더 중 터진 에러는 window.onerror로 잡히지 않아 별도로 받아야 한다.
// 잡지 않으면 React가 트리 전체를 언마운트해서 빈 화면만 남는다.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    captureError(error, { source: 'react_error_boundary' });
    console.error('[ErrorBoundary]', error, errorInfo.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Wrapper>
        <Title>화면을 불러오지 못했어요</Title>
        <Description>잠시 후 다시 시도해주세요.</Description>
        <ReloadButton type="button" onClick={this.handleReload}>
          새로고침
        </ReloadButton>
      </Wrapper>
    );
  }
}

export default ErrorBoundary;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  min-height: 50vh;
  padding: 2rem;
  background-color: ${BackgroundWhite.primary};
`;

const Title = styled.h2`
  ${typographyCss(Typography.heading2.bold)}
  color: ${Label.normal};
`;

const Description = styled.p`
  ${typographyCss(Typography.body1Normal.regular)}
  color: ${Label.alternative};
`;

const ReloadButton = styled.button`
  margin-top: 0.8rem;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 0.8rem;
  background-color: ${Orange.o500};
  color: ${BackgroundWhite.primary};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.regular)}
`;
