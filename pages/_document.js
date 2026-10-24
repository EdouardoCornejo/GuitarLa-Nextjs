import { Html, Head, Main, NextScript } from 'next/document'

export default function DOcument() {
    return(
        <Html lang='es'>
            <Head>
                <meta name='description' content='GuitarLA - Venta de guitarras y blog de música'/>
                <meta name='theme-color' content='#262626'/>
                <link rel='icon' href='/favicon.ico' sizes='48x48' />
                <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
                <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={'true'} />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap" rel="stylesheet" />
                <link rel='stylesheet' href='https://necolas.github.io/normalize.css/8.0.1/normalize.css' />

            </Head>

            <body>
                <Main/>
                <NextScript/>
            </body>
        </Html>
    )
}