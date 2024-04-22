import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [workCenterId, setWorkCenterId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [operation, setOperation] = useState(1);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:8080/employee/list")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  };

  const openModal = (op, id, fName, lName, addr, mail, wcId, depId) => {
    setOperation(op);
    setSelectedEmployeeId(id);
    if (op === 1) {
      setTitle("Añadir Empleado");
      setFirstName("");
      setLastName("");
      setAddress("");
      setEmail("");
      setWorkCenterId("");
      setDepartmentId("");
    } else {
      setTitle("Editar Empleado");
      setFirstName(fName);
      setLastName(lName);
      setAddress(addr);
      setEmail(mail);
      setWorkCenterId(wcId);
      setDepartmentId(depId);
    }
  };

  const validate = () => {
    if (!firstName || !lastName || !address || !email || !workCenterId || !departmentId) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Por favor, introduce un email válido.");
      return;
    }

    if (operation === 1) {
      addEmployee();
    } else {
      editEmployee();
    }
  };

  const addEmployee = () => {
    axios
      .post("http://localhost:8080/employee/save", {
        firstName,
        lastName,
        address,
        email,
        workCenter: { id: workCenterId },
        department: { id: departmentId }
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

  const editEmployee = () => {
    const updatedEmployee = {
      id: selectedEmployeeId,
      firstName,
      lastName,
      address,
      email,
      workCenter: { id: workCenterId },
      department: { id: departmentId }
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

  const deleteEmployee = (id, fName, lName) => {
    Swal.fire({
      title: `¿Estás seguro que deseas eliminar a ${fName} ${lName}?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8080/employee/delete/${id}`)
          .then(() => {
            fetchEmployees();
            Swal.fire({
              title: "¡Éxito!",
              text: "El empleado ha sido eliminado correctamente.",
              icon: "success",
            });
          })
          .catch((error) => {
            console.error("Error deleting employee:", error);
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error al intentar eliminar el empleado.",
              icon: "error",
            });
          });
      }
    });
  };

  const closeModal = () => {
    setTitle("");
    setFirstName("");
    setLastName("");
    setAddress("");
    setEmail("");
    setWorkCenterId("");
    setDepartmentId("");
    setOperation(1);
    setSelectedEmployeeId(null);
  };

  const validateEmail = (email) => {
    const re =
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <div className="container">
      <div className="row mt-3">
        <div className="col-md-4 offset-md-4">
          <div className="d-grid mx-auto">
            <button
              onClick={() => openModal(1)}
              className="btn btn-dark mb-3"
              data-bs-toggle="modal"
              data-bs-target="#modalEmployees"
            >
              <i className="fa-solid fa-circle-plus"></i> Añadir Empleado
            </button>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Dirección</th>
                  <th>Email</th>
                  <th>Centro de Trabajo</th>
                  <th>Departamento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(employees) && employees.map((employee, index) => (
                  <tr key={index}>
                    <td>{employee.id}</td>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>{employee.address}</td>
                    <td>{employee.email}</td>
                    <td>{employee.workCenter.location}</td>
                    <td>{employee.department.name}</td>
                    <td>
                      <button
                        onClick={() =>
                          openModal(
                            2,
                            employee.id,
                            employee.firstName,
                            employee.lastName,
                            employee.address,
                            employee.email,
                            employee.workCenter.id,
                            employee.department.id
                          )
                        }
                        className="btn btn-outline-warning me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#modalEmployees"
                      >
                        <i className="fa-solid fa-edit"></i> Editar
                      </button>
                      <button
                        onClick={() =>
                          deleteEmployee(
                            employee.id,
                            employee.firstName,
                            employee.lastName
                          )
                        }
                        className="btn btn-outline-danger"
                      >
                        <i className="fa-solid fa-trash"></i> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div id="modalEmployees" className="modal fade" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                id="btnClose"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Dirección"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  placeholder="Centro de Trabajo (ID)"
                  value={workCenterId}
                  onChange={(e) => setWorkCenterId(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  placeholder="Departamento (ID)"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                />
              </div>
              <div className="d-grid col-6 mx-auto">
                <button onClick={validate} className="btn btn-success">
                  {operation === 1 ? (
                    <span>
                      <i className="fa-solid fa-plus"></i> Agregar
                    </span>
                  ) : (
                    <span>
                      <i className="fa-solid fa-save"></i> Guardar Cambios
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
