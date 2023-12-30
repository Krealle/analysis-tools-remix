import "../styles/Info.css";
const Information: React.FC = () => {
  return (
    <div className="info-box">
      <p>
        This application depends on your authorization with Warcraft Logs (WCL)
        to gather fight data. This enables functionality with private logs that
        you have permission to access.
      </p>
    </div>
  );
};

export default Information;
