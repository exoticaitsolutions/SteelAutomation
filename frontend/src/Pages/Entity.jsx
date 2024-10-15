import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";


function AddClient() {

  const [username, setUsername] = useState("");
  const [submitData, setSubmitData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("please enter entity name ");
      return;
    }
    setError("");
    setSubmitData(username);
  };

  useEffect(() => {
    const createEntity = async () => {
      if (submitData) {
        const token = localStorage.getItem("userToken");

        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/entities/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${token}`
            },
            body: JSON.stringify({ entity_name: submitData }),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          //   const data = await response.json();
          //   console.log("Entity created:", data);
          toast.success("Entity created successfully!");
          setUsername("");
        } catch (error) {
          console.error("Error creating entity:", error);
        }
      }
    };

    createEntity();
  }, [submitData]);

  return (
    <div className="container">
      <Sidebar />
      <section className="main">
        <div className="main-top">
          <div className="heading">
            <h2>Create Entity</h2>
          </div>
        </div>

        <div className="main-skills">
          <section className="add_client_page">
            <div className="containerr">
              <form className="form" onSubmit={handleSubmit}>
                <div className="fields_main">
                  <div className="sec_field">
                    <label>Entity Name</label>
                    <input type="text" placeholder="Entity Name" value={username} onChange={(e) => setUsername(e.target.value)} />
                    {error && <div className="error-message">{error}</div>}
                  </div>
                </div>

                <div className="submit_btn">
                  <input className="form_submit" type="submit" value="Save" />
                </div>
              </form>
            </div >
          </section >
        </div>

      </section>
      <ToastContainer />
    </div>
  );
}
export default AddClient;