import {Tab, Tabs} from 'react-bootstrap'
import React,{useState} from 'react';
import EmployeeCrud from './components/EmployeeCrud';
import WorkCenterCrud from './components/WorkCenterCrud';
import DepartmentCrud from './components/DepartmentCrud';

function App() {
  const [key, setKey] = useState('employee'); // Estado para mantener la pestaña activa

  return (
    <Tabs
      id="controlled-tab"
      activeKey={key}
      onSelect={(k) => setKey(k)}
    >
      <Tab eventKey="employee" title="Empleados">
        <EmployeeCrud />
      </Tab>
      <Tab eventKey="workcenter" title="Centro de trabajo">
        <WorkCenterCrud />
      </Tab>
      <Tab eventKey="department" title="Departamento">
        <DepartmentCrud/>
      </Tab>
    </Tabs>
  );
}

export default App;
