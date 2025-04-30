import { Link } from "react-router-dom";
import hublyImage from "../../assets/hubly.png";
import "./Header.css";
const Header = () => {
  return (
    <div className="header">
      <div className="logo">
        <img src={hublyImage} alt="" />
        <h1 className="hubly-head">Hubly</h1>
      </div>
      <div className="auth-section">
        <Link to="/login" className="login">
          Login
        </Link>
        <Link to="/signup" className="signup">
          Sign up
        </Link>
      </div>
    </div>
  );
};
export default Header;
