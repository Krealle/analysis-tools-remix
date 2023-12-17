export const WCLAuthorization: React.FC = () => {
  const handleAuthorization = async () => {
    try {
      const response = await fetch("/api/authorize", {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result.message);
      } else {
        const errorResult = await response.json();
        console.error("Authorization failed:", errorResult.error);
      }
    } catch (error) {
      console.error("Error during authorization:", error);
    }
  };

  return (
    <>
      <h2>Warcraft Logs Authorization</h2>
      <button onClick={handleAuthorization}>Get WCL Auth</button>
    </>
  );
};
