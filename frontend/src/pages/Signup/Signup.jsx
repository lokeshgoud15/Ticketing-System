import "./Signup.css";
import loginImage from "../../assets/loginImage.png";
import hublyImage from "../../assets/hubly.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [signupData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } =
      signupData;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast("Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      toast("Passwords do not match");
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
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: password,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      if (data.success) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Internal server error");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <Link to="/" className="logo1">
          <img src={hublyImage} alt="" />
          <h1 className="hubly-head1">Hubly</h1>
        </Link>
      </div>
      <div className="signup-inner">
        <div className="signup-middle">
          <div className="signup-head">
            <h1>Create an account</h1>
            <Link to="/login">Sign in instead</Link>
          </div>

          <form onSubmit={handleSubmit} action="">
            <div className="input-field">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstname"
                name="firstName"
                onChange={(e) => handleChange(e)}
                value={signupData.firstName}
              />
            </div>
            <div className="input-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastname"
                name="lastName"
                onChange={(e) => handleChange(e)}
                value={signupData.lastName}
              />
            </div>
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={(e) => handleChange(e)}
                value={signupData.email}
              />
            </div>
            <div className="input-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => handleChange(e)}
                value={signupData.password}
              />
            </div>
            <div className="input-field">
              <label htmlFor="confirmpassword">Confirm Password</label>
              <input
                type="password"
                id="confirmpassword"
                name="confirmPassword"
                onChange={(e) => handleChange(e)}
                value={signupData.confirmPassword}
              />
            </div>

            <div className="check-field">
              <input type="checkbox" />
              <p>
                By creating an account, I agree to our{" "}
                <span className="terms-cons">
                  Terms of use and Privacy Policy
                </span>{" "}
              </p>
            </div>
            <button type="submit" className="signup-btn">
              Create an account
            </button>
          </form>

          <div>
            <p className="terms">
              This site is protected by reCAPTCHA and the{" "}
              <span className="span-text">Google Privacy Policy</span> and{" "}
              <span className="span-text">Terms of Service</span> apply
            </p>
          </div>
        </div>
      </div>
      <div className="signup-right">
        <img className="signup-image" src={loginImage} alt="" />
      </div>
      <ToastContainer />
    </div>
  );
};
export default Signup;
