const Footer = () => {
  return (
    <div className="footer">
      <footer>
        <small>
          <span>
            All data is retrieved from&nbsp;
            <a
              href="https://warcraftlogs.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Warcraft Logs
            </a>
            .
          </span>
          <span>
            Bear Emotes from&nbsp;
            <a
              href="https://yilinzc.carrd.co/"
              target="_blank"
              rel="noopener noreferrer"
            >
              yilinzc
            </a>
            .
          </span>
          <span>
            Results shown here are not 100% accurate, for more details&nbsp;
            <a
              href="https://github.com/Krealle/analysis-tools-remix/issues/1"
              target="_blank"
              rel="noopener noreferrer"
            >
              click here
            </a>
            .
          </span>
        </small>
      </footer>
    </div>
  );
};

export default Footer;
