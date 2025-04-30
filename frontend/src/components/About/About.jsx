import "./About.css";

import socialMedia from "../../assets/socialmedia.png";
const About = () => {
  return (
    <div className="about">
      <div className="about-head">
        <h2>At its core, Hubly is a robust CRM solution.</h2>
        <p>
          Hubly helps businesses streamline customer interactions, track leads,
          and automate tasks—saving you time and maximizing revenue. Whether
          you’re a startup or an enterprise, Hubly adapts to your needs, giving
          you the tools to scale efficiently.
        </p>
      </div>
      <div className="about-body">
        <div className="about-body-left">
          <div className="each-about">
            <h3>MULTIPLE PLATFORMS TOGETHER! </h3>
            <p>
              Email communication is a breeze with our fully integrated, drag &
              drop email builder.
            </p>
          </div>
          <div className="each-about">
            <h3>CLOSE</h3>
            <p>
              Capture leads using our landing pages, surveys, forms, calendars,
              inbound phone system & more!
            </p>
          </div>
          <div className="each-about">
            <h3>NATURE</h3>
            <p>
              Capture leads using our landing pages, surveys, forms, calendars,
              inbound phone system & more!
            </p>
          </div>
        </div>
        <div className="about-body-right">
          <img src={socialMedia} alt="" />
          <div className="boxes">
            <div className="capture">
              <p className="liness-1"></p>
              <h4>CAPTURE</h4>
            </div>
            <div className="nature">
              <p className="liness-2"></p>
              <h4>NATURE</h4>
            </div>
            <div className="clos">
              <p className="liness-3"></p>
              <h4>CLOSE</h4>
            </div>

            <div className="box-1"></div>
            <div className="box-2"></div>
            <div className="box-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
