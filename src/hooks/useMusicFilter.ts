import { useState, useEffect, useMemo } from "react";
import { DatasetRow } from "../api.types";

const useMusicFilter = (dataset: DatasetRow[], selectedArtist: string) => {
  const [filteredSongs, setFilteredSongs] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedArtist) {
      setFilteredSongs([]);
      return;
    }
    const songs = dataset
      .filter((row) => row.artist === selectedArtist)
      .map((row) => row.song);
    setFilteredSongs(Array.from(new Set(songs)));
  }, [dataset, selectedArtist]);

  const allArtists = useMemo(() => {
    return Array.from(new Set(dataset.map((d) => d.artist))).sort();
  }, [dataset]);

  return { filteredSongs, allArtists };
};

export default useMusicFilter;
