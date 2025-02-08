import React, { useMemo, useState } from "react";
import ConfigurationPanel from "./ConfigurationPanel";
import { DatasetRow } from "../api.types";
import DetailedEntry from "./DetailedEntry";

interface MusicSelectionPanelProps {
  dataset: DatasetRow[];
  allArtists: string[];
  filteredSongs: string[];
  selectedIRSfilename: string;
  selectedArtist: string;
  setSelectedArtist: React.Dispatch<React.SetStateAction<string>>;
  selectedSong: string;
  setSelectedSong: React.Dispatch<React.SetStateAction<string>>;
  onRetrieveSimilar: () => void;
}

const MusicSelectionPanel: React.FC<MusicSelectionPanelProps> = ({
  dataset,
  allArtists,
  filteredSongs,
  selectedIRSfilename,
  selectedArtist,
  setSelectedArtist,
  selectedSong,
  setSelectedSong,
  onRetrieveSimilar,
}) => {
  const [showQuerySongDetails, setShowQuerySongDetails] = useState(false);
  const querySongDetails = useMemo(() => {
    return dataset.find(
      (d) => d.artist === selectedArtist && d.song === selectedSong
    );
  }, [dataset, selectedArtist, selectedSong]);
  if (!selectedIRSfilename) {
    return null;
  }

  return (
    <>
      <h2>Select query artist and song:</h2>
      <>
        <div style={{ marginBottom: "10px" }}>
          <label>Artist: </label>
          <select
            value={selectedArtist}
            onChange={(e) => setSelectedArtist(e.target.value)}
          >
            <option value="">--Select Artist--</option>
            {allArtists.map((artist) => (
              <option key={artist} value={artist}>
                {artist}
              </option>
            ))}
          </select>

          <label style={{ marginLeft: "10px" }}>Song: </label>
          <select
            value={selectedSong}
            onChange={(e) => setSelectedSong(e.target.value)}
          >
            <option value="">--Select Song--</option>
            {filteredSongs.map((song) => (
              <option key={song} value={song}>
                {song}
              </option>
            ))}
          </select>

          <button style={{ marginLeft: "10px" }} onClick={onRetrieveSimilar}>
            Retrieve Similar
          </button>
        </div>
      </>
      {querySongDetails && (
        <ConfigurationPanel
          checkboxChecked={showQuerySongDetails}
          setCheckboxChecked={setShowQuerySongDetails}
          checkboxMessage={"Display query song details"}
        />
      )}
      {querySongDetails && showQuerySongDetails && (
        <DetailedEntry entry={querySongDetails} />
      )}
      {selectedIRSfilename === "late_fusion_1000.json" && (
        <div style={{ marginTop: "10px", color: "red" }}>
          Note: The selected system contains only 1000 tracks and their
          retrievals.
        </div>
      )}
    </>
  );
};

export default MusicSelectionPanel;
