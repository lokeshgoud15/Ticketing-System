import { useEffect, useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import "./Profile.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((store) => store.user.user);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [saveBtn, setSaveBtn] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //update the user profile and logout
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
            password: profileData.password,
            confirmPassword: profileData.confirmPassword,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);
  useEffect(() => {
    if (
      user &&
      (user.firstname !== profileData.firstName ||
        user.lastname !== profileData.lastName ||
        profileData.password.length > 0 ||
        profileData.confirmPassword.length > 0)
    ) {
      setSaveBtn(false);
    } else {
      setSaveBtn(true);
    }
  }, [user, profileData]);

  return (
    <div>
      <p className="profile-text">Settings</p>
      <div className="profile-container">
        <span className="edit-head">Edit Profile</span>
        <hr />
        <div className="profile-form">
          <form onSubmit={handleSubmit} action="">
            <div className="input-field">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstname"
                name="firstName"
                onChange={(e) => handleChange(e)}
                value={`${profileData.firstName}`}
              />
            </div>
            <div className="input-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastname"
                name="lastName"
                onChange={(e) => handleChange(e)}
                value={`${profileData.lastName}`}
              />
            </div>
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <div className="email-field">
                <input
                  disabled={true}
                  type="email"
                  id="email"
                  name="email"
                  onChange={(e) => handleChange(e)}
                  value={`${user ? user.email : profileData.email}`}
                />
                <div className="tooltip">
                  <CiCircleInfo className="info-icon" />
                  <span className="tooltiptext">
                    {" "}
                    You can't change your email
                  </span>
                </div>
              </div>
            </div>
            <div className="input-field">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={(e) => handleChange(e)}
                  value={profileData.password}
                />
                <div className="tooltip">
                  <CiCircleInfo className="info-icon" />
                  <span className="tooltiptext">
                    {" "}
                    Your password must be at least 6 characters
                  </span>
                </div>
              </div>
            </div>
            <div className="input-field">
              <label htmlFor="confirmpassword">Confirm Password</label>
              <div className="confirmPassword-field">
                <input
                  type="password"
                  id="confirmpassword"
                  name="confirmPassword"
                  onChange={(e) => handleChange(e)}
                  value={profileData.confirmPassword}
                />
                <div className="tooltip">
                  <CiCircleInfo className="info-icon" />
                  <span className="tooltiptext">
                    User will logout Immediately
                  </span>
                </div>
              </div>
            </div>

            <button
              disabled={saveBtn}
              type="submit"
              className={`save-btn ${saveBtn ? "disabled-btn" : ""}`}
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Profile;
