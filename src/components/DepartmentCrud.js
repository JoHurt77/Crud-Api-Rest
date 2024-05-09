import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Pagination from "./Pagination";

const DepartmentCrud = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [operation, setOperation] = useState(1);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/department/list`)
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  };

  const openModal = (op, id, depName) => {
    setOperation(op);
    setSelectedDepartmentId(id);
    if (op === 1) {
      setName("");
    } else {
      setName(depName);
    }
  };

  const validate = () => {
    if (!name) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (operation === 1) {
      addDepartment();
    } else {
      editDepartment();
    }
  };

  const addDepartment = () => {
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/department/save`, {
        name,
      })
      .then(() => {
        fetchDepartments();
        closeModal();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "El departamento se ha añadido correctamente.",
        });
      })
      .catch((error) => {
        console.error("Error adding department:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error al intentar añadir el departamento.",
        });
      });
  };

  const editDepartment = () => {
    const updatedDepartment = {
      id: selectedDepartmentId,
      name,
    };

    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/department/update/${selectedDepartmentId}`, updatedDepartment)
      .then(() => {
        fetchDepartments();
        closeModal();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "El departamento ha sido actualizado correctamente.",
        });
      })
      .catch((error) => {
        console.error("Error editing department:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error al intentar actualizar el departamento.",
        });
      });
  };

  const deleteDepartment = (id, depName) => {
    Swal.fire({
      title: `¿Estás seguro que deseas eliminar el departamento "${depName}"?`,
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
          .delete(`${process.env.REACT_APP_API_BASE_URL}/department/delete/${id}`)
          .then(() => {
            fetchDepartments();
            Swal.fire({
              title: "¡Éxito!",
              text: "El departamento ha sido eliminado correctamente.",
              icon: "success",
            });
          })
          .catch((error) => {
            console.error("Error deleting department:", error);
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error al intentar eliminar el departamento.",
              icon: "error",
            });
          });
      }
    });
  };

  const closeModal = () => {
    setName("");
    setOperation(1);
    setSelectedDepartmentId(null);
  };

   //Pagination
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage] = useState(10);
 
   // Get current departments
   const indexOfLastDepartment = currentPage * itemsPerPage;
   const indexOfFirstDepartment = indexOfLastDepartment - itemsPerPage;
   const currentDepartments = departments.slice(
     indexOfFirstDepartment,
     indexOfLastDepartment
   );
 
   // Change page
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <div className="row mt-3">
        <div className="col-md-4 offset-md-4">
          <div className="d-grid mx-auto">
            <button
              onClick={() => openModal(1)}
              className="btn btn-dark mb-3"
              data-bs-toggle="modal"
              data-bs-target="#modalDepartments"
            >
              <i className="fa-solid fa-circle-plus"></i> Añadir Departamento
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(currentDepartments) && currentDepartments.map((department, index) => (
                  <tr key={index}>
                    <td>{department.id}</td>
                    <td>{department.name}</td>
                    <td>
                      <button
                        onClick={() =>
                          openModal(
                            2,
                            department.id,
                            department.name
                          )
                        }
                        className="btn btn-outline-warning me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#modalDepartments"
                      >
                        <i className="fa-solid fa-edit"></i> Editar
                      </button>
                      <button
                        onClick={() =>
                          deleteDepartment(
                            department.id,
                            department.name
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
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={departments.length}
              paginate={paginate}
            />
          </div>
        </div>
      </div>
      <div id="modalDepartments" className="modal fade" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Agregar/Editar Departamento</h5>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

export default DepartmentCrud;
