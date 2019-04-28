import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import localforage from 'localforage';


//storage - using localForage
localforage.config({
    driver: [localforage.INDEXEDDB,
        localforage.WEBSQL,
        localforage.LOCALSTORAGE],
    name: 'eSchoolAppDB'
});


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
