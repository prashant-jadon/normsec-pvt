import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite/config';

const FormPasswordRest = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is logged in
        const checkLoginStatus = () => {
            // Your logic to check the user's login status
            const loggedIn = true; // Example logic, replace with actual logic
            setIsLoggedIn(loggedIn);
        };

        checkLoginStatus();
    }, []);

    const submit = async () => {
       

        let urlSearchParams = new URLSearchParams(window.location.search);
        let secret = urlSearchParams.get("secret");
        let userId = urlSearchParams.get("userId");

        if (userId && secret) {
            try {
                await account.updateRecovery(userId, secret, password);
                window.location.href = "/#/login";
            } catch (error) {
                alert(error);
            }
        } else {
            alert('User ID or secret not found in the URL.');
        }
    };

    // Redirect if user is logged in
    if (isLoggedIn) {
        window.location.href = "/"; // Replace with your desired URL
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
                    required />

                <label htmlFor="confirmPassword"><b>Confirm Password</b></label>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required />

                <button className="button" type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default FormPasswordRest;
