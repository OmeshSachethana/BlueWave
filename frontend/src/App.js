// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Employee from './pages/Employee';  // Import the Employee page

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Employee /> {/* Render Employee page */}
      </div>
    </Provider>
  );
}

export default App;
