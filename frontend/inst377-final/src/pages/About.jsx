import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>About This Project</h1>
      <div className="about-content">
        <p>
          This site simplifies access to U.S. Treasury fiscal data for students and researchers.
          We focus specifically on key indicators from the Monthly Treasury Statement (MTS), including total revenue and spending.
        </p>
        
        <p>
          Revenue refers to the money the federal government collects, primarily through income taxes, corporate taxes, and other sources.
        </p>
        
        <p>
          Spending represents the money the government uses to fund programs, services, and obligations, such as social security, defense, and infrastructure.
        </p>
        
        <p>
          The goal of this tool is to make these financial trends easier to explore through simple charts and informative tables. 
          All data is sourced directly from the U.S. Treasury API and updated using RESTful calls. Users can load and view current year-to-date values without needing to sift through raw government datasets that are often difficult to use.
        </p>
      </div>
    </div>
  );
}

export default About;