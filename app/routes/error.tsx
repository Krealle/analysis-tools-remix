import { useLocation } from "react-router-dom";

export default function ErrorPage(): JSX.Element {
  const location = useLocation();
  const message = new URLSearchParams(location.search).get("message");

  return (
    <div>
      <h1>Oh no! An Error happened.</h1>
      <div>
        <img
          src="/static/bear/not-like-256.png"
          loading="lazy"
          alt="An error occurred:"
        />
      </div>
      <h3>{message}</h3>
      <button onClick={() => (window.location.href = "/")}>Go back</button>
    </div>
  );
}
