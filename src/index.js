import React from 'react';
import ReactDOM from 'react-dom';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
// import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import App from './App';
import '@fortawesome/fontawesome-free/css/all.css';
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';
import { OrderProvider } from './Components/OrderPageComp/OrderContext';

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"/>
// import theme from './theme'; // Assuming you have a theme.js file
const cache = createCache({
  key: 'my-cache',
  prepend: true,
});

ReactDOM.render(
  <CacheProvider value={cache}>
    {/* <ThemeProvider theme={theme}> */}
      <CssBaseline />
      <OrderProvider>
      <App />
    {/* </ThemeProvider> */}
    </OrderProvider>,
  </CacheProvider>,
  document.getElementById('root')
);
