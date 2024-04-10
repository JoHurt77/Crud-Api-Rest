import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const EmployeeSave = ({ firstName, lastName, address, email, fetchEmployees, closeModal }) => {
  const addEmployee = () => {
    axios
      .post("http://localhost:8080/employee/save", {
        firstName,
        lastName,
        address,
        email,
      })
      .then(() => {
        fetchEmployees();
        closeModal();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "El empleado se ha añadido correctamente.",
        });
      })
      .catch((error) => {
        console.error("Error adding employee:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error al intentar añadir el empleado.",
        });
      });
  };

  return (
    <button onClick={addEmployee}>
      Añadir empleado
    </button>
  );
};

export default EmployeeSave;
