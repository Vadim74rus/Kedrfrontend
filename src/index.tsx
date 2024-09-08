import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRouter from './AppRouter';

ReactDOM.render(
    <Provider store={store}>
        <AppRouter />
    </Provider>,
    document.getElementById('root')
);
