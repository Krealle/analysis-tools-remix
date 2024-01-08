import { ReactNode } from "react";

/* eslint-disable react/prop-types */
type OptionBoxProps = {
  title: string;
  children: ReactNode;
};

const OptionBox: React.FC<OptionBoxProps> = ({ title, children }) => {
  const content = (
    <div className="flex container">
      <div className="flex title">
        <big>{title}</big>
      </div>
      <div className="flex abilities">{children}</div>
    </div>
  );
  return content;
};

export default OptionBox;
