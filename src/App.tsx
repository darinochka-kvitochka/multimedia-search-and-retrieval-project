import React, { useState } from "react";
import useFetchData from "./hooks/useFetchData";
import useMusicFilter from "./hooks/useMusicFilter";
import AvailableSystemsTable from "./components/AvailableSystemsTable";
import RetrievalsTable from "./components/RetrievalsTable";
import MusicSelectionPanel from "./components/MusicSelectionPanel";
import "./App.css";
// import SystemSelectionPanel from "./components/SystemSelectionPanel";

const App: React.FC = () => {
  const [selectedIRSfilename, setSelectedIRSfilename] = useState<string>("");
  const { dataset, precomputedSystems, precomputedResults } =
    useFetchData(selectedIRSfilename);

  const [selectedArtist, setSelectedArtist] = useState("");
  const [selectedSong, setSelectedSong] = useState("");
  const { filteredSongs, allArtists } = useMusicFilter(dataset, selectedArtist);

  const [retrievals, setRetrievals] = useState(dataset);
  const [videoLoadedMap, setVideoLoadedMap] = useState<Record<string, boolean>>(
    {}
  );
  const [retrievalMessage, setRetrievalMessage] = useState("");

  const handleRetrieveSimilar = () => {
    if (!precomputedResults) return;
    const row = dataset.find(
      (d) => d.artist === selectedArtist && d.song === selectedSong
    );
    if (!row) {
      alert("Selected song not found in dataset");
      return;
    }
    const queryId = row.id;
    const retrievedIds = precomputedResults.content[queryId] || [];
    const retrievals = dataset.filter((d) => retrievedIds.includes(d.id));
    setRetrievals(retrievals);
    setVideoLoadedMap({});
    setRetrievalMessage(
      `Songs retrieved with the system ${
        precomputedSystems![selectedIRSfilename].IR_system_name
      } (${selectedIRSfilename}):`
    );
  };

  if (!dataset || !precomputedSystems) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Information Retrieval System</h1>
      {/* <SystemSelectionPanel
        precomputedSystems={precomputedSystems}
        setSelectedIRSfilename={setSelectedIRSfilename}
      /> */}
      <AvailableSystemsTable
        precomputedSystems={precomputedSystems}
        selectedIRSfilename={selectedIRSfilename}
        setSelectedIRSfilename={setSelectedIRSfilename}
      />
      <MusicSelectionPanel
        dataset={dataset}
        allArtists={allArtists}
        filteredSongs={filteredSongs}
        selectedIRSfilename={selectedIRSfilename}
        selectedArtist={selectedArtist}
        setSelectedArtist={setSelectedArtist}
        selectedSong={selectedSong}
        setSelectedSong={setSelectedSong}
        onRetrieveSimilar={handleRetrieveSimilar}
      />
      <RetrievalsTable
        retrievals={retrievals}
        retrievalMessage={retrievalMessage}
        videoLoadedMap={videoLoadedMap}
        setVideoLoadedMap={setVideoLoadedMap}
      />
    </div>
  );
};

export default App;
