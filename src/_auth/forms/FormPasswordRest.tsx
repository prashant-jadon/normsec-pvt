import { account } from '@/lib/appwrite/config';
import  { useState } from 'react';

const FormPasswordRest = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const submit = async () => {
      let urlSearchParams = new URLSearchParams(window.location.search);
      let secret = urlSearchParams.get("secret");
      let userId = urlSearchParams.get("userId");

      if (userId && secret) {
        try {
            await account.updateRecovery(userId, secret, password);
          //  window.location.href = "/#/login";
        } catch (error) {
            alert(error);
        }
    } else {
        alert('User ID or secret not found in the URL.');
    }
};

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
