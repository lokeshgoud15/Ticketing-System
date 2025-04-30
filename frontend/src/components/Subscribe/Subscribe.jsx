import "./Subscribe.css";
const Subscribe = () => {
  return (
    <div className="subscribe">
      <div className="subscribe-head">
        <h2>We have plans for everyone!</h2>
        <p>
          We started with a strong foundation, then simply built all of the
          sales and marketing tools ALL businesses need under one platform.
        </p>
      </div>
      <div className="subscribe-body">
        <div className="starter-plan">
          <h3
            style={{ fontSize: "36px", fontWeight: "bold", color: "#30404D" }}
          >
            STARTER
          </h3>
          <p
            style={{
              color: "#30404D",
              fontFamily: "Barlow",
              fontSize: "20px",
              fontWeight: "500",
            }}
          >
            Best for local businesses needing to improve their online
            reputation.
          </p>
          <h1 className="starter-price">
            $199 <span>/monthly</span>
          </h1>
          <div className="starter-features">
            <h5>What's included</h5>
            <div className='feature'>
              <span className="tick">&#10004;</span>
              <p>Unlimited users</p>
            </div>
            <div className='feature'>
              <span className="tick">&#10004;</span>
              <p>GMB Messaging</p>
            </div>
            <div className='feature'>
              <span className="tick">&#10004;</span>
              <p>Reputation Management</p>
            </div>
            <div className='feature'>
              <span className="tick">&#10004;</span>
              <p>GMB Call Tracking</p>
            </div>
            <div className='feature'>
              <span className="tick">&#10004;</span>
              <p>24/7 Award Winning Support</p>
            </div>
          </div>
          <div className="sign-up-for-starter">SIGN UP FOR STARTER</div>
        </div>

        <div className="grow-plan">
          <h3
            style={{ fontSize: "36px", fontWeight: "bold", color: "#30404D" }}
          >
            GROW
          </h3>
          <p
            style={{
              color: "#30404D",
              fontFamily: "Barlow",
              fontSize: "20px",
              fontWeight: "500",
            }}
          >
            Best for all businesses that want to take full control of their
            marketing automation and track their leads, click to close.
          </p>
          <h1 className="grow-price">
            $399 <span>/monthly</span>
          </h1>
          <div className="grow-features">
            <h5>What's included</h5>
            <div className='feature'>
              <span className="tick">&#10004;</span>
              <p>Pipeline Management</p>
            </div>
            <div className='feature'>
              <span className="tick">&#10004;</span>
              <p>Marketing Automation Campaigns</p>
            </div>
            <div className='feature'>
              <span className="tick">&#10004;</span>
              <p>Live Call Transfer</p>
            </div>
            <div className='feature'>
              <span className="tick">&#10004;</span>
              <p>GMB Messaging</p>
            </div>
            <div className='feature'>
              <span className="tick">&#10004;</span>
              <p>Embed-able Form Builder</p>
            </div>
            <div className='feature'>
              <span className="tick">&#10004;</span>
              <p>Reputation Management</p>
            </div>
            <div className='feature'>
              <span className="tick">&#10004;</span>
              <p>24/7 Award Winning Support</p>
            </div>
          </div>
          <div className="sign-up-for-grow">SIGN UP FOR GROW</div>
        </div>
      </div>
    </div>
  );
};
export default Subscribe;
