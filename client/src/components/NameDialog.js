import React, { useState } from "react";
import "./NameDialog.css";

function NameDialog({ onClose, onCreate }) {
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim());
      onClose();
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <div className="title3">Create a new document</div>
        <p className="subtitle">Enter a name for your document:</p>
        
        <input
          type="text"
          value={name}
          className = "name-input"
          placeholder="Click Create when done."
          onChange={(e) => setName(e.target.value)}
        />
        
        <div className="dialog-actions">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={handleCreate} className="create-btn">Create</button>
        </div>
      </div>
    </div>
  );
}

export default NameDialog;
