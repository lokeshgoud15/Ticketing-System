import "./Login.css";
import loginImage from "../../assets/loginImage.png";
import hublyImage from "../../assets/hubly.png";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../Slices/userSlice";

const Login = () => {
  const loading = useSelector((store) => store.user.loading);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;
    if (!email || !password) {
      toast("Please fill all the fields");
      return;
    }
    if (password.length < 6) {
      toast("Password must be at least 6 characters long");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("Invalid email format");
      return;
    }

    try {
      dispatch(setLoading(true));

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      if (data.success) {
        dispatch(setUser(data.user));
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
      dispatch(setLoading(false));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <Link to="/" className="logo1">
          <img src={hublyImage} alt="" />
          <h1 className="hubly-head1">Hubly</h1>
        </Link>
      </div>
      <div className="login-inner">
        <div className="login-middle">
          <h1>Sign in to your plexify</h1>

          <form onSubmit={handleLogin} action="">
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input
                className="input"
                type="text"
                id="email"
                name="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="input-field">
              <label htmlFor="password">Password</label>
              <input
                className="input"
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>
            <button disabled={loading} type="submit" className="login-btn">
              Log in
            </button>
          </form>

          <p className="forgot-password">Forgot Password?</p>
          <p className="signup-txt">
            Don't have an account?{" "}
            <Link className="signup-link" to="/signup">
              Sign up
            </Link>
          </p>
          <div>
            <p className="terms">
              This site is protected by reCAPTCHA and the{" "}
              <span className="span-text">Google Privacy Policy</span> and{" "}
              <span className="span-text">Terms of Service</span> apply
            </p>
          </div>
        </div>
      </div>
      <div className="login-right">
        <img className="login-image" src={loginImage} alt="" />
      </div>
      <ToastContainer />
    </div>
  );
};
export default Login;
