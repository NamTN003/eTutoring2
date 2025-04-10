import React, { useState } from 'react';
import axios from 'axios';
import './CreateSubject.css';

const CreateSubject = () => {
  const [form, setForm] = useState({
    subject_code: "",
    subject_name: "",
    description: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_HOST}/subject`, form, {
        headers: { "Content-Type": "application/json" }
      });
      alert("✅ Subject created successfully!");
      setForm({
        subject_code: "",
        subject_name: "",
        description: ""
      });
    } catch (error) {
      console.error("❌ Error creating subject:", error.response ? error.response.data : error);
      alert("An error occurred!");
    }
  };

  return (
    <div className="subject-container">
      <h2 className="subject-title">📘 Create New Subject</h2>
      <form className="subject-form" onSubmit={handleSubmit}>
        <div className="subject-group">
          <label>Subject Code</label>
          <input
            type="text"
            name="subject_code"
            value={form.subject_code}
            onChange={handleChange}
            placeholder="e.g. MTH001"
            required
          />
        </div>
        <div className="subject-group">
          <label>Subject Name</label>
          <input
            type="text"
            name="subject_name"
            value={form.subject_name}
            onChange={handleChange}
            placeholder="e.g. Mathematics"
            required
          />
        </div>
        <div className="subject-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter a description for the subject..."
            rows="4"
          />
        </div>
        <button type="submit" className="subject-submit">➕ Create Subject</button>
      </form>
    </div>
  );
};

export default CreateSubject;
