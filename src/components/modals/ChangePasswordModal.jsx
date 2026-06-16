import React, { useState } from 'react';
import { changePassword } from '../../api/userApi';
import { toast } from 'react-toastify';

export default function ChangePasswordModal({
    isOpen,
    onClose
}) {
    const [form, setForm] = useState({
        CompId: 1,
        UserId: 1,
        UserCode: "U001",
        OldPassword: "",
        NewPassword: ""
    });

    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            if (form.OldPassword === form.NewPassword) {
                toast.warning(
                    'New password cannot be same as old password'
                );
                return;
            }
            // if (form.NewPassword.length < 6) {
            //     toast.warning(
            //         'Password must be at least 6 characters'
            //     );
            //     return;
            // }

            const response = await changePassword(form);

            if (response.success) {
                toast.success('Password changed successfully');

                setForm({
                    ...form,
                    OldPassword: '',
                    NewPassword: ''
                });

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

                    <div className="form-group">
                        <label>Old Password</label>
                        <input
                            type="password"
                            name="OldPassword"
                            value={form.OldPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="NewPassword"
                            value={form.NewPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
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