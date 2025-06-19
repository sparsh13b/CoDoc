import React, { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import NameDialog from "../components/NameDialog";

function Home() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const handleCreateDoc = (name) => {
    const id = uuidv4();
    const recentDocs = JSON.parse(localStorage.getItem("recentDocs")) || [];
    recentDocs.unshift({ id, name });
    localStorage.setItem("recentDocs", JSON.stringify(recentDocs));
    navigate(`/doc/${id}`);
  };

  const recentDocs = JSON.parse(localStorage.getItem("recentDocs")) || [];

  return (
    <div className="home-container">
      <div className="logodiv">
        <img src="https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png " alt="logo" width="50" height="50" />
        <span>CoDoc</span>
        <div className="navbar-text">
          Google Docs inspired real-time document editor.  
          </div>
        
        
      </div>
      <div className="container1">
      <div className="new-doc-section">
        <div class="title">Start a new document</div>
        
        <div className="new-doc-box" onClick={() => setShowDialog(true)}>
          <img
            src="https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png"
            alt="plus"
          />
        </div>
        <div className="new-doc-text">Blank document</div>
      </div>
      </div>

      <div className="recent-docs">
        <div class="title1">Recent documents</div>
        <div className="doc-grid">
          {recentDocs.map((doc) => (
            <div
              className="doc-card"
              key={doc.id}
              onClick={() => navigate(`/doc/${doc.id}`)}
            >
              <img
                src="https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png"
                alt="doc"
              />
              <p>{doc.name}</p>
            </div>
          ))}
        </div>
      </div>

      {showDialog && (
        <NameDialog
          onClose={() => setShowDialog(false)}
          onCreate={handleCreateDoc}
        />
      )}
    </div>
  );
}

export default Home;
