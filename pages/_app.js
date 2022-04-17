import '@styles/normalize.css'
import '@styles/webflow.css'
import '@styles/wizardlabsnft.webflow.css'

function Application({ Component, pageProps }) {
    return (
            <body>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
                <Component {...pageProps} />
            </body>
    );
}

export default Application
