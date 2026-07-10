import React, { useState } from 'react';
import { changePassword } from '../../api/userApi';
import { toast } from 'react-toastify';
import './Modals.css';

export default function ChangePasswordModal({
    isOpen,
    onClose
}) {
    const [form, setForm] = useState({
        CompId: 1,
        UserId: 1,
        UserCode: "U001",
        OldPassword: "",
        NewPassword: "",
        ConfirmNewPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    if (!isOpen) return null;

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // Old Password validation
        if (!form.OldPassword.trim()) {
            newErrors.OldPassword = 'Old password is required';
        }

        // New Password validation
        if (!form.NewPassword.trim()) {
            newErrors.NewPassword = 'New password is required';
        } else if (form.NewPassword.length < 6) {
            newErrors.NewPassword = 'Password must be at least 6 characters';
        } else if (form.OldPassword === form.NewPassword) {
            newErrors.NewPassword = 'New password cannot be the same as old password';
        }

        // Confirm Password validation
        if (!form.ConfirmNewPassword.trim()) {
            newErrors.ConfirmNewPassword = 'Please confirm your password';
        } else if (form.NewPassword !== form.ConfirmNewPassword) {
            newErrors.ConfirmNewPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({
            ...touched,
            [name]: true
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const response = await changePassword(form);

            if (response.success) {
                toast.success('Password changed successfully');

                setForm({
                    CompId: 1,
                    UserId: 1,
                    UserCode: "U001",
                    OldPassword: '',
                    NewPassword: '',
                    ConfirmNewPassword: ''
                });
                setErrors({});
                setTouched({});

                onClose();
            } else {
                toast.error(response.message || 'Password change failed');
            }
        } catch (err) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h3>Change Password</h3>

                <form onSubmit={handleSubmit}>

                    <div className="form-group" >
                        <label>Old Password <span className="required">*</span></label>
                        <input
                            type="password"
                            name="OldPassword"
                            value={form.OldPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={touched.OldPassword && errors.OldPassword ? 'input-error' : ''}
                            required
                            style={{"max-width": "380px"}}
                        />
                        {touched.OldPassword && errors.OldPassword && (
                            <span className="error-message">{errors.OldPassword}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>New Password <span className="required">*</span></label>
                        <input
                            type="password"
                            name="NewPassword"
                            value={form.NewPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={touched.NewPassword && errors.NewPassword ? 'input-error' : ''}
                            style={{"max-width": "380px"}}
                            required
                        />
                        {touched.NewPassword && errors.NewPassword && (
                            <span className="error-message">{errors.NewPassword}</span>
                        )}
                    </div>
                    
                    <div className="form-group">
                        <label>Confirm New Password <span className="required">*</span></label>
                        <input
                            type="password"
                            name="ConfirmNewPassword"
                            value={form.ConfirmNewPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={touched.ConfirmNewPassword && errors.ConfirmNewPassword ? 'input-error' : ''}
                            style={{"max-width": "380px"}}
                            required
                        />
                        {touched.ConfirmNewPassword && errors.ConfirmNewPassword && (
                            <span className="error-message">{errors.ConfirmNewPassword}</span>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn-save"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}