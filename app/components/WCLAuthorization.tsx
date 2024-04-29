import { useState } from "react";

const WCLAuthorization: React.FC = () => {
  const [authorizationUrl, setAuthorizationUrl] = useState<string | null>(null);

  const handleAuthorization = async (): Promise<string | undefined> => {
    const response = await fetch("/wclAuth?init");

    /** Dev token set */
    if (response.redirected) return (window.location.href = response.url);

    const data = await response.json();

    if (response.ok) {
      setAuthorizationUrl(data.authorizationUrl);
    } else {
      console.error(data);
    }
  };

  if (authorizationUrl) {
    window.location.href = authorizationUrl;
  }

  return (
    <>
      <h2>Warcraft Logs Authorization</h2>
      <button
        onClick={() => {
          const res = handleAuthorization();

          if (res instanceof Promise) {
            res.catch((err) => console.error(err));
          }
        }}
      >
        Get WCL Auth
      </button>
    </>
  );
};

export default WCLAuthorization;
