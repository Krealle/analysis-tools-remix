import React, { useState, useCallback } from "react";
import "../../styles/genericStyling.css";

interface PopupProps {
  content: React.ReactNode;
  name: string;
  disabled?: boolean;
}

const PopupContent: React.FC<PopupProps> = ({ content, name, disabled }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = useCallback(() => setPopupOpen(true), []);
  const closePopup = useCallback(() => setPopupOpen(false), []);

  return (
    <>
      <button onClick={openPopup} disabled={disabled}>
        {name}
      </button>
      {isPopupOpen && (
        <div className="popup-overlay flex">
          <div className="popup-content">
            <button onClick={closePopup} className="close-button">
              X
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default PopupContent;
