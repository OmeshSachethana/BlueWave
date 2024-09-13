import React from 'react';
import EmployeeList from './components/employee/EmployeeList';
import EmployeeForm from './components/employee/EmployeeForm';
import ProductList from './components/products/ProductList';
import SpecialPromotions from './components/products/SpecialPromotions';

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

