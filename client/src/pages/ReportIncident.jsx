import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportIncident() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/incidents", formData);
    navigate("/");
  };

  return (
  <div className="min-h-screen bg-gray-100 flex justify-center items-center">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Report Incident
      </h2>

      <input
        className="w-full mb-3 p-2 border rounded"
        name="title"
        placeholder="Title"
        onChange={handleChange}
        required
      />

      <input
        className="w-full mb-3 p-2 border rounded"
        name="category"
        placeholder="Category"
        onChange={handleChange}
        required
      />

      <input
        className="w-full mb-3 p-2 border rounded"
        name="location"
        placeholder="Location"
        onChange={handleChange}
        required
      />

      <textarea
        className="w-full mb-3 p-2 border rounded"
        name="description"
        placeholder="Description"
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  </div>
);

}

export default ReportIncident;
