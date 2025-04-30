import "./CompaniesUse.css";
import Adobe from "../../assets/Adobelogo.png";
import Airtable from "../../assets/Airtable.png";
import Elastic from "../../assets/Elastic.png";
import Framer from "../../assets/Framer.png";
import opendoor from "../../assets/Opendoor.png";
const CompaniesUse = () => {
  return (
    <div className="companies-box">
      <div className="companies-use">
        <img className="company-images" src={Adobe} alt="" />
      </div>
      <div className="companies-use">
        {" "}
        <img className="company-images" src={Elastic} alt="" />
      </div>
      <div className="companies-use">
        <img className="company-images" src={opendoor} alt="" />
      </div>
      <div className="companies-use">
        {" "}
        <img className="company-images" src={Airtable} alt="" />
      </div>
      <div className="companies-use">
        {" "}
        <img className="company-images" src={Elastic} alt="" />
      </div>
      <div className="companies-use">
        <img className="company-images" src={Framer} alt="" />
      </div>
    </div>
  );
};
export default CompaniesUse;
