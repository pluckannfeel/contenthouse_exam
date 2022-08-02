import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import createRootReducer from '@redux/rootReducer'
import lastModifiedMiddleware from '@redux/middleware/lastModified'
import ScrollToTop from '@components/ScrollToTop'
import BackOfficeRoutes from './BackOffice/routes'
import ThemeProvider from './theme'

import './App.css'

const store = configureStore({
  reducer: createRootReducer(),
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: {
      ignoredActionPaths: ['_options.mergeOptions.customMerge'],
    },
  }).concat(lastModifiedMiddleware),
})

function App(){
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Provider store={store}>
          <ThemeProvider>
            <ScrollToTop />
            <BackOfficeRoutes />
          </ThemeProvider>
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
