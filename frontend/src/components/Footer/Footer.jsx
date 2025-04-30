import "./Footer.css";
import hublyImage from "../../assets/hubly.png";

import { FiFigma, FiMail, FiTwitter,FiYoutube,FiDisc, FiLinkedin, FiInstagram } from "react-icons/fi";
const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-left">
        <img src={hublyImage} alt="" />
        <h1 className="hubly-head">Hubly</h1>
      </div>
      <div className="footer-right">
        <div className="footer-features">
          <h6>Product</h6>
          <div className="featuress">
            <p>Universal checkout</p>
            <p>Payment workflows</p>
            <p>Observability</p>
            <p>UpliftAI</p>
            <p>Apps & integrations</p>
          </div>
        </div>
        <div className="footer-features">
          <h6>Why Primer</h6>
          <div className="featuress">
            <p>Expand to new markets</p>
            <p>Boost payment success</p>
            <p>Improve conversion rates</p>
            <p>Reduce payments fraud</p>
            <p>Recover revenue</p>
          </div>
        </div>
        <div className="footer-features">
          <h6>Developers</h6>
          <div className="featuress">
            <p>Primer Docs</p>
            <p>API Reference</p>
            <p>Payment methods guide</p>
            <p>Service status</p>
            <p>Community</p>
          </div>
        </div>
        <div className="footer-features">
          <h6>Resources</h6>
          <div className="featuress">
            <p>Blog</p>
            <p>Success stories</p>
            <p>News room</p>
            <p>Terms</p>
            <p>Privacy</p>
          </div>
        </div>
        <div className="footer-features">
          <h6>Company</h6>
          <div className="featuress">
            <p>Carrers</p>
          </div>
        </div>
        <div className="footer-features">
          <div className="icons">
            <FiMail className="icon"/>
            <FiLinkedin className="icon"/>
            <FiTwitter className="icon"/>
            <FiYoutube className="icon"/>
            <FiDisc className="icon"/>
            <FiFigma className="icon"/>
            <FiInstagram className="icon"/>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
