if (typeof window === 'undefined') {
  Object.defineProperty(global, 'localStorage', {
    value: global.localStorage,
    configurable: true,
    enumerable: true,
    writable: true,
  });
}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
