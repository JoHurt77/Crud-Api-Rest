import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const WorkCenterCrud = () => {
  const [workCenters, setWorkCenters] = useState([]);
  const [location, setLocation] = useState("");
  const [operation, setOperation] = useState(1);
  const [selectedWorkCenterId, setSelectedWorkCenterId] = useState(null);

  useEffect(() => {
    fetchWorkCenters();
  }, []);

  const fetchWorkCenters = () => {
    axios
      .get("http://localhost:8080/workCenter/list")
      .then((response) => {
        setWorkCenters(response.data);
      })
      .catch((error) => {
        console.error("Error fetching work centers:", error);
      });
  };

  const openModal = (op, id, loc) => {
    setOperation(op);
    setSelectedWorkCenterId(id);
    if (op === 1) {
      setLocation("");
    } else {
      setLocation(loc);
    }
  };

  const validate = () => {
    if (!location) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (operation === 1) {
      addWorkCenter();
    } else {
      editWorkCenter();
    }
  };

  const addWorkCenter = () => {
    axios
      .post("http://localhost:8080/workCenter/save", {
        location,
      })
      .then(() => {
        fetchWorkCenters();
        closeModal();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "El centro de trabajo se ha añadido correctamente.",
        });
      })
      .catch((error) => {
        console.error("Error adding work center:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error al intentar añadir el centro de trabajo.",
        });
      });
  };

  const editWorkCenter = () => {
    const updatedWorkCenter = {
      id: selectedWorkCenterId,
      location,
    };

    axios
      .put(`http://localhost:8080/workCenter/update/${selectedWorkCenterId}`, updatedWorkCenter)
      .then(() => {
        fetchWorkCenters();
        closeModal();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "El centro de trabajo ha sido actualizado correctamente.",
        });
      })
      .catch((error) => {
        console.error("Error editing work center:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error al intentar actualizar el centro de trabajo.",
        });
      });
  };

  const deleteWorkCenter = (id, loc) => {
    Swal.fire({
      title: `¿Estás seguro que deseas eliminar el centro de trabajo "${loc}"?`,
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
          .delete(`http://localhost:8080/workCenter/delete/${id}`)
          .then(() => {
            fetchWorkCenters();
            Swal.fire({
              title: "¡Éxito!",
              text: "El centro de trabajo ha sido eliminado correctamente.",
              icon: "success",
            });
          })
          .catch((error) => {
            console.error("Error deleting work center:", error);
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error al intentar eliminar el centro de trabajo.",
              icon: "error",
            });
          });
      }
    });
  };

  const closeModal = () => {
    setLocation("");
    setOperation(1);
    setSelectedWorkCenterId(null);
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
              data-bs-target="#modalWorkCenters"
            >
              <i className="fa-solid fa-circle-plus"></i> Añadir Centro de Trabajo
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
                  <th>Ubicación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(workCenters) && workCenters.map((workCenter, index) => (
                  <tr key={index}>
                    <td>{workCenter.id}</td>
                    <td>{workCenter.location}</td>
                    <td>
                      <button
                        onClick={() =>
                          openModal(
                            2,
                            workCenter.id,
                            workCenter.location
                          )
                        }
                        className="btn btn-outline-warning me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#modalWorkCenters"
                      >
                        <i className="fa-solid fa-edit"></i> Editar
                      </button>
                      <button
                        onClick={() =>
                          deleteWorkCenter(
                            workCenter.id,
                            workCenter.location
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
      <div id="modalWorkCenters" className="modal fade" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Agregar/Editar Centro de Trabajo</h5>
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
                  placeholder="Ubicación"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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

export default WorkCenterCrud;
