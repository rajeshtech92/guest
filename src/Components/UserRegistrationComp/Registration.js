import React, { useState } from 'react';
import axios from 'axios';
import './Registration.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
function Registration() {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };
 
    const validateForm = () => {
        let errors = {};
        if (formValues.password !== formValues.confirmPassword) {
            errors.confirmPassword = <span style={{color:'rgb(171,73,53)'}}>Passwords do not match.</span>;
        }
 
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const response = await axios.post('https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Users/register', formValues);
                setFormValues(response.data)
                if(response.status === 201){
                    toast.success('Registration successful!..');
                }
                setTimeout(() => {
                    navigate('/login')
                }, 1000)
 
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Error while registration.';
                toast.error(errorMessage);
            } finally {
                setIsSubmitting(false);
            }
        }
    };
 
    return (
        <div className="wrapper">
            <ToastContainer />
            <div className="container" style={{ width: '100%', background:'#ffff' }}>
                <div className="title">Registration</div>
                <div className="content">
                    <form onSubmit={handleSubmit}>
                        <div className="user-details">
                            <div className="input-box">
                                <span className="details">First Name</span>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter your name"
                                    value={formValues.firstName}
                                    onChange={handleChange}
                                    style={{ borderColor: formErrors.firstName ? 'red' : '' }}
                                    required
                                />
                                {formErrors.firstName && <div className="error-message">{formErrors.firstName}</div>}
                            </div>
                            <div className="input-box">
                                <span className="details">Last Name</span>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter your username"
                                    value={formValues.lastName}
                                    onChange={handleChange}
                                    style={{ borderColor: formErrors.lastName ? 'red' : '' }}
                                    required
                                />
                                {formErrors.lastName && <div className="error-message">{formErrors.lastName}</div>}
                            </div>
                            <div className="input-box">
                                <span className="details">Email</span>
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formValues.email}
                                    onChange={handleChange}
                                    style={{ borderColor: formErrors.email ? 'red' : '' }}
                                    required
                                />
                                {formErrors.email && <div className="error-message">{formErrors.email}</div>}
                            </div>
                            <div className="input-box">
                                <span className="details">Phone Number</span>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Enter your number"
                                    value={formValues.phoneNumber}
                                    onChange={handleChange}
                                    style={{ borderColor: formErrors.phoneNumber ? 'red' : '' }}
                                    required
                                />
                                {formErrors.phoneNumber && <div className="error-message">{formErrors.phoneNumber}</div>}
                            </div>
                            <div className="input-box">
                                <span className="details">Password</span>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formValues.password}
                                    onChange={handleChange}
                                    style={{ borderColor: formErrors.password ? 'red' : '' }}
                                    required
                                />
                                {formErrors.password && <div className="error-message">{formErrors.password}</div>}
                            </div>
                            <div className="input-box">
                                <span className="details">Confirm Password</span>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formValues.confirmPassword}
                                    onChange={handleChange}
                                    style={{ borderColor: formErrors.confirmPassword ? 'red' : '' }}
                                    required
                                />
                                {formErrors.confirmPassword && <div className="error-message">{formErrors.confirmPassword}</div>}
                            </div>
                        </div>
                        <div className="button">
                            <input type="submit" value="Register" disabled={isSubmitting} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
 
export default Registration;
 