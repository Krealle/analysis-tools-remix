/* eslint-disable react/prop-types */
import "../../styles/genericStyling.css";

type ButtonCheckboxProps = {
  onClick: () => void;
  selected: boolean;
  flavorText?: string;
  title?: string;
  id?: string;
  disabled?: boolean;
  content?: JSX.Element;
};

const ButtonCheckbox: React.FC<ButtonCheckboxProps> = ({
  onClick,
  selected,
  flavorText,
  title,
  id,
  disabled,
  content,
}) => {
  return (
    <div
      className={`buttonCheckbox flex ${selected ? "selected" : ""}`}
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !disabled) {
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      id={id}
    >
      {title && <span className="title">{title}</span>}
      {flavorText && (
        <>
          <br />
          <span className="flavorText">{flavorText}</span>
        </>
      )}
      {content}
    </div>
  );
};

export default ButtonCheckbox;
