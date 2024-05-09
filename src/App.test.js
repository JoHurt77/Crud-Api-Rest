import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza las pestañas', () => {
  render(<App />);
  
  const tab1 = screen.getByText(/Empleados/i);
  const tab2 = screen.getByText(/Centro de trabajo/i);
  const tab3 = screen.getByText(/Departamento/i);

  expect(tab1).toBeInTheDocument();
  expect(tab2).toBeInTheDocument();
  expect(tab3).toBeInTheDocument();
});
