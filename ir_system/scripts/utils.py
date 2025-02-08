import ast
import pandas as pd


def load_dataset_with_info():
    """
    Load and merge multiple datasets related to multimedia search and retrieval.
    This function performs the following steps:
    1. Loads genre, metadata, information, tags, listens, and URL datasets from TSV files.
    2. Strips whitespace from column names.
    3. Parses the 'genre' and '(tag, weight)' columns from string representations to Python objects.
    4. Merges all datasets on the 'id' column into a single DataFrame.
    Returns:
        pd.DataFrame: A DataFrame containing the merged data from all input datasets.
    Load the genre, metadata, and information datasets.
    Merge them into one and parse the 'genre' column.
    """

    genre_file = "../dataset/id_genres_mmsr.tsv"
    info_file = "../dataset/id_information_mmsr.tsv"

    def load_and_strip(file_path):
        df = pd.read_csv(file_path, sep="\t")
        df.columns = df.columns.str.strip()
        return df

    # Load and process datasets
    genres = load_and_strip(genre_file)
    info = load_and_strip(info_file)
    metadata_data = load_and_strip("../dataset/id_metadata_mmsr.tsv").rename(
        columns={"key": "song_key"}
    )
    tags_data = load_and_strip("../dataset/id_tags_dict.tsv")
    listens_data = load_and_strip("../dataset/id_total_listens.tsv")
    url_data = load_and_strip("../dataset/id_url_mmsr.tsv")

    # Parse 'genre' and '(tag, weight)' columns
    genres["genre"] = genres["genre"].apply(ast.literal_eval)
    tags_data["(tag, weight)"] = tags_data["(tag, weight)"].apply(ast.literal_eval)

    # Merge all datasets on the 'id' column
    dataset = (
        genres.merge(info, on="id")
        .merge(metadata_data, on="id")
        .merge(tags_data, on="id")
        .merge(listens_data, on="id")
        .merge(url_data, on="id")
    )

    return dataset


def load_and_merge_tfidf_data(dataset, tfidf_embeddings_path):
    """
    Load TF-IDF embeddings and merge with the main dataset.

    Args:
    ----
    dataset: pd.DataFrame
        The main dataset containing song information.
    tfidf_embeddings_path: str
        Path to the TF-IDF embeddings file.

    Returns:
    -------
    pd.DataFrame
        Merged dataset with TF-IDF embeddings.
    """
    tfidf_data = pd.read_csv(tfidf_embeddings_path, sep="\t")
    tfidf_data = tfidf_data.drop(columns=["song"])
    tfidf_columns = tfidf_data.columns[1:]
    merged_tfidf_dataset = pd.merge(dataset, tfidf_data, on="id")
    return merged_tfidf_dataset, tfidf_columns
