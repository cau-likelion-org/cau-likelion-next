import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {' '}
            {initialProps.styles} {sheet.getStyleElement()}{' '}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          {/* 본문 폰트. 렌더를 막는 외부 스타일시트는 이 하나만 남긴다.
              (Inter는 어디서도 font-family로 쓰이지 않아 제거, GmarketSans는 CSS만 256KB라 제거) */}
          <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
          />

          {/* PWA (iOS는 홈 화면에 추가한 경우에만 웹 푸시가 동작) */}
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#FF6000" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="중앙대 멋사" />
          <link rel="apple-touch-icon" href="/apple-icon-180x180.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
