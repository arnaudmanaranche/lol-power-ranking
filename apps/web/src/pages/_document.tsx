import Document, { Head, Html, Main, NextScript } from 'next/document'

class AppDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#03acbf" />
          <link rel="apple-touch-icon" href="" />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="https://assets.vercel.com/image/upload/q_auto/front/favicon/vercel/152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="https://assets.vercel.com/image/upload/q_auto/front/favicon/vercel/180x180.png"
          />
          <meta property="fb:app_id" content="229332461869949" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://lol-power-ranking.app" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://lol-power-ranking.app" />
          <meta name="twitter:site" content="@a_manaranche" />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="preload"
            href="/fonts/cabin-bold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/fonts/cabin-regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="true"
          />
        </Head>
        <body className="font-body antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument
