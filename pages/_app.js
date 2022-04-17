import '@styles/normalize.css'
import '@styles/webflow.css'
import '@styles/wizardlabsnft.webflow.css'
import '@styles/local.css'

function Application({ Component, pageProps }) {
    return (
            <main>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
                <Component {...pageProps} />
            </main>
    );
}

export default Application
