import { useState } from 'react';
import { useUserContext } from '@/context/AuthContext';

const FormPasswordRest = () => {
    const { isAuthenticated } = useUserContext(); // Get isAuthenticated state from context
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const submit = async () => {
     
        // Your password reset logic here
    };

    if (isAuthenticated) {
        // Redirect to dashboard or any other desired page if user is already authenticated
        window.location.href = "/#/dashboard";
        return null; // Prevent rendering the password reset form
    }

    return (
        <div>
            <h1>Reset your password</h1>
            <form onSubmit={submit}>
                <label htmlFor="password"><b>New Password</b></label>
                <input
                    type="password"
                    placeholder="Enter New Password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <label htmlFor="confirmPassword"><b>Confirm Password</b></label>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                />
                <button className="button" type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default FormPasswordRest;
