import { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from 'next-auth/react';
import {Provider as StyletronProvider} from 'styletron-react';
import {DarkTheme, BaseProvider, styled} from 'baseui';
import {styletron} from '../styletron';

const Centered = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});

const App = ({ Component, pageProps }: AppProps<{session: Session;}>) => {
  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={DarkTheme}>
        <Centered>
          <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
          </SessionProvider>
        </Centered>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default App;
