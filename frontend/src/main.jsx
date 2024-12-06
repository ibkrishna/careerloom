import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from './components/ui/sonner.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js' 

const stripePromise = loadStripe('pk_test_51QKd8GP5mvchvauDx6uFRBJGYjVDkWOTLHhDxYwpCiJ1ywK47aRCAmROLPRQUnx6uKRUSMhpP8QXhjQbxLTPdaGY00lGyWhHEc');

const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Elements stripe={stripePromise}>
          <App />
          <Toaster />
        </Elements>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
