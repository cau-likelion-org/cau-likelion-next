import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Script from 'next/script';
import GA from 'src/test/GA';

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
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;900;500;600;700;800&display=swap"
            rel="stylesheet"
          />
          <link href="https://webfontworld.github.io/gmarket/GmarketSans.css" rel="stylesheet" />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
          />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap" rel="stylesheet" />
          <script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
        </Head>
        <body>
          {/* {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? <GA ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} /> : null} */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
