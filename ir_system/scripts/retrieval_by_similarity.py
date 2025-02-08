from sklearn.metrics.pairwise import cosine_similarity, euclidean_distances
import pandas as pd

def retrieve_n_songs_by_similarity(query_song, dataset, feature_columns, metric='cosine', N=10):
    """
    Compute similarity using the specified metric.

    Args
    ----
        query_song
            The query song (row) from the dataset.
        dataset
            Full dataset containing features for similarity computation.
        feature_columns
            List of columns corresponding to feature embeddings.
        metric
            Similarity metric to use ('cosine', 'euclidean').
        N
            Number of top results to retrieve.

    Returns
    -------
        pandas.DataFrame
            A DataFrame of the top N similar songs with similarity scores.
    """
    # Extract the feature vector for the query song
    query_vector = query_song[feature_columns].values.reshape(1, -1)
    feature_matrix = dataset[feature_columns].values

    # Compute similarity or distance
    if metric == 'cosine':
        similarities = cosine_similarity(query_vector, feature_matrix).flatten()
    elif metric == 'euclidean':
        distances = euclidean_distances(query_vector, feature_matrix).flatten()
        similarities = 1 / (1 + distances)  # Convert distances to similarity
    else:
        raise ValueError("Unsupported metric. Use 'cosine' or 'euclidean'.")

    # Add similarity scores to dataset and exclude the query song
    dataset['similarity'] = similarities
    results = dataset[dataset['id'] != query_song['id']].sort_values(by='similarity', ascending=False)

    return results.head(N)