export const WCLAuthorization: React.FC = () => {
  const handleAuthorization = async () => {
    try {
      const response = await fetch("/api/userAuth");
      const data = await response.json();

      if (response.ok) {
        window.location.href = data.headers.Location;
      } else {
        console.error(data);
      }
    } catch (error) {
      console.error("Error fetching WCL authorization:", error);
    }
  };

  return (
    <>
      <h2>Warcraft Logs Authorization</h2>
      <button onClick={handleAuthorization}>Get WCL Auth</button>
    </>
  );
};
