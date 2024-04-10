import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const EmployeeEdit = ({ selectedEmployeeId, firstName, lastName, address, email, fetchEmployees, closeModal }) => {
  const editEmployee = () => {
    const updatedEmployee = {
      id: selectedEmployeeId,
      firstName,
      lastName,
      address,
      email,
    };

    axios
      .put(`http://localhost:8080/employee/update`, updatedEmployee)
      .then(() => {
        fetchEmployees();
        closeModal();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "El empleado ha sido actualizado correctamente.",
        });
      })
      .catch((error) => {
        console.error("Error editing employee:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error al intentar actualizar el empleado.",
        });
      });
  };

  return (
    <button onClick={editEmployee}>
      Editar empleado
    </button>
  );
};

export default EmployeeEdit;
