import { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from 'next-auth/react';
import {Provider as StyletronProvider} from 'styletron-react';
import {DarkTheme, BaseProvider, styled} from 'baseui';
import {styletron} from '../styletron';
import '../styles.css'

const App = ({ Component, pageProps }: AppProps<{session: Session;}>) => {
  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={DarkTheme}>
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default App;
