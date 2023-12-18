/* eslint-disable react/prop-types */
export enum FetchStatus {
  FETCHING = "FETCHING",
  ANALYZING = "ANALYZING",
}

export const fetchStatusMap: Record<FetchStatus, string> = {
  FETCHING: "Fetching data",
  ANALYZING: "Analyzing data",
};

export const fetchStatusIconMap: Record<FetchStatus, string> = {
  FETCHING: "/static/bear/dance.gif",
  ANALYZING: "/static/bear/detective-256.png",
};

type FetchingStatusProps = {
  status?: FetchStatus;
  customMsg?: string;
};

const FetchingStatus: React.FC<FetchingStatusProps> = ({
  status,
  customMsg,
}) => {
  if (!status) return <></>;
  return (
    <div>
      <big>{customMsg ? customMsg : fetchStatusMap[status]}</big>
      <br />
      <img
        src={fetchStatusIconMap[status]}
        loading="lazy"
        alt="we do be fetching"
      />
    </div>
  );
};

export default FetchingStatus;
