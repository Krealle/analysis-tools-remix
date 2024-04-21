import React, { ReactNode, useEffect, useRef, useState } from "react";
import "../../styles/genericStyling.css";

type CollapseProps = {
  isExpanded: boolean;
  children: ReactNode;
};

const Collapse: React.FC<CollapseProps> = ({ isExpanded, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  /** This is a slight hack to ensure that the overflow doesn't cutoff our borders
   * on our fight boxes when they are hovered over. */
  const [minWidth, setMinWidth] = useState(0);

  useEffect(() => {
    if (isExpanded) {
      setHeight(ref.current?.getBoundingClientRect().height ?? 0);
      setMinWidth((ref.current?.getBoundingClientRect().width ?? 0) + 50);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  return (
    <div className="collapse" style={{ height, minWidth }}>
      <div ref={ref}>{children}</div>
    </div>
  );
};

export default Collapse;
