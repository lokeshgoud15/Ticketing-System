import { Link } from "@mui/material";
import "./Testing.css";
import { useNavigate } from "react-router-dom";
const Testing = () => {
  const navigate = useNavigate();
  return (
    <div className="testing-container">
      <h1 className="testing-title">This is Testing Page</h1>
      <p className="testing-description">
        Welcome to the testing page. Use this page to verify and explore
        functionalities without signing in.
      </p>
      <Link
        onClick={() => navigate("/")}
        style={{ textDecoration: "none", marginTop: "60px", cursor: "pointer" }}
      >
        Go to Home Page
      </Link>
    </div>
  );
};
export default Testing;
