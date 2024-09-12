// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import EmployeeList from './components/employee/EmployeeList';
import EmployeeForm from './components/employee/EmployeeForm';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <EmployeeForm />
        <EmployeeList />
      </div>
    </Provider>
  );
}

export default App;
