import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { Layout } from 'components/Layout';
import { Provider } from 'react-redux';
import Notifications from './Notifications';
import store from 'store';
import 'styles/main.scss';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#ba0d2f' },
    secondary: { main: '#dc99a6' },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Layout title={Component.pageTitle} subtitle={Component.pageSubtitle}>
          <Notifications />
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
