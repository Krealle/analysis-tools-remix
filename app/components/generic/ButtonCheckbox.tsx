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
  disabled = false,
  content,
}) => {
  const handleClick = (): void => {
    if (!disabled) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && !disabled) {
      onClick();
    }
  };

  return (
    <div
      className={`buttonCheckbox flex ${selected ? "selected" : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
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
