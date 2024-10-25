import React, { useState } from 'react';
import './Address.css';
import { useNavigate } from 'react-router-dom';

const OrderAddressForm = () => {
  const navigate = useNavigate();

  // Define state for the form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  // Define state for validation errors
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error message on input change
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.address1) newErrors.address1 = 'Address Line 1 is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zip) newErrors.zip = 'Zip Code is required';
    if (!formData.country) newErrors.country = 'Country is required';

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form inputs
    const formErrors = validateForm();
    
    // If there are errors, set them and do not submit the form
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // If no errors, proceed with form submission
    console.log('Form Data Submitted: ', formData);
    navigate('/menuOrder'); // Navigate to the next page
  };

  return (
    <div className="container-fluid">
      <h1>Shipping Address</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address1">Address Line 1</label>
          <input
            type="text"
            id="address1"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            placeholder="Street address, P.O. box, etc."
            required
          />
          {errors.address1 && <span className="error-message">{errors.address1}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address2">Address Line 2</label>
          <input
            type="text"
            id="address2"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            placeholder="Apartment, suite, unit, etc. (optional)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
            required
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="state">State/Province/Region</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter your state"
            required
          />
          {errors.state && <span className="error-message">{errors.state}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="zip">Zip/Postal Code</label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            placeholder="Enter your zip code"
            required
          />
          {errors.zip && <span className="error-message">{errors.zip}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select your country</option>
            <option value="IN">India</option>
            <option value="US">USA</option>
            <option value="UK">United Kingdom</option>
          </select>
          {errors.country && <span className="error-message">{errors.country}</span>}
        </div>

        <div className="form-group">
          <button type="submit" className="submit-btn">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default OrderAddressForm;
