import { useState } from "react";

export const ClientForm = ({ setUserInfo }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setUserInfo(formData)
    };
  }

  return (
    <form onSubmit={handleFormSubmit} className="client-form">
      <label>
        Nome:
        <input
          type="text"
          name="name"
          placeholder="User"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          placeholder="User@email.com"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </label>
      <button type="submit">Enviar</button>
    </form>
  );
};