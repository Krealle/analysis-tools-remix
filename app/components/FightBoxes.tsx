import { formatDuration, formatUnixTime, toCamelCase } from "../util/format";
import { ButtonCheckbox } from "./generic/ButtonCheckbox";
import "../styles/FightBoxes.css";
import { EncounterImages } from "../util/enemyTables";
import useWCLUrlInputStore from "../zustand/WCLUrlInputStore";
import useStatusStore from "../zustand/statusStore";
import useFightBoxesStore from "../zustand/fightBoxesStore";

export const FightBoxes = () => {
  const { selectedIds, removeId, addId } = useFightBoxesStore();

  const isFetching = useStatusStore((state) => state.isFetching);
  const report = useWCLUrlInputStore((state) => state.fightReport);

  const handleDivClick = (id: number) => {
    const isSelected = selectedIds.includes(id);
    if (isSelected) {
      removeId(id);
    } else {
      addId(id);
    }
  };

  if (!report?.fights) {
    return;
  }

  // Group fights by name
  const fightsByName = report.fights.reduce((acc, fight) => {
    if (fight.difficulty) {
      const groupName = fight.name ?? "Unknown";
      acc[groupName] = acc[groupName] || [];
      acc[groupName].push(fight);
    }
    return acc;
  }, {} as Record<string, typeof report.fights>);

  return (
    <div>
      {Object.entries(fightsByName).map(([groupName, fights]) => {
        const normalizedGroupName = toCamelCase(groupName);
        /* const imageUrl = `https://assets.rpglogs.com/img/warcraft/bosses/${EncounterIds[normalizedGroupName]}-tile.jpg`; */
        return (
          <div
            key={groupName}
            className="flex column fightContainer"
            /* style={{
              backgroundImage: `url(${imageUrl})`,
            }} */
          >
            <div className="flex fightsName">
              <img src={EncounterImages[normalizedGroupName]} alt="" />
              {groupName}
            </div>
            <div className="flex fights">
              {fights.map((fight) => {
                const fightPercentageColor = fight.kill
                  ? "kill"
                  : !fight.fightPercentage
                  ? ""
                  : fight.fightPercentage > 70
                  ? "common"
                  : fight.fightPercentage > 50
                  ? "uncommon"
                  : fight.fightPercentage > 30
                  ? "rare"
                  : fight.fightPercentage > 10
                  ? "epic"
                  : fight.fightPercentage > 1
                  ? "legendary"
                  : "unfort";

                const content = (
                  <>
                    <div className="flex column">
                      <span
                        className={`fightPercentage ${fightPercentageColor}`}
                      >
                        {fight.kill ? "KILL" : `${fight.fightPercentage}%`}
                      </span>
                      <span className="phase">
                        {fight.lastPhase ?? 0 > 0 ? `P${fight.lastPhase}` : ""}
                      </span>
                    </div>
                    <div className="flex column">
                      <span className={fight.kill ? "kill" : "wipe"}>
                        {`${fight.id} - (${formatDuration(
                          fight.endTime - fight.startTime
                        )})`}
                      </span>
                      <span>
                        {formatUnixTime(fight.startTime + report.startTime)}
                      </span>
                    </div>
                  </>
                );

                return (
                  <ButtonCheckbox
                    key={fight.id}
                    onClick={() => handleDivClick(fight.id)}
                    selected={selectedIds.includes(fight.id)}
                    content={content}
                    id={"fightButton"}
                    disabled={isFetching}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
