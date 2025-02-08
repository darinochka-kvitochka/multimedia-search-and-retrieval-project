import pandas as pd
from scripts.random_baseline import random_baseline
from scripts.relevance_computation import compute_weighted_jaccard
from scripts.retrieval_by_similarity import retrieve_n_songs_by_similarity
from sklearn.metrics import ndcg_score
from tqdm import tqdm


# Accuracy Metrics
# Compute Precision@K
def precision_at_k(retrieved, relevant, k=10):
    retrieved_relevant = [song for song in retrieved[:k] if song in relevant]
    return len(retrieved_relevant) / k


# Compute Recall@K
def recall_at_k(retrieved, relevant, k=10):
    retrieved_relevant = [song for song in retrieved[:k] if song in relevant]
    return len(retrieved_relevant) / len(relevant) if relevant else 0


# Compute Mean Reciprocal Rank (MRR)
def mean_reciprocal_rank(retrieved, relevant):
    for idx, song in enumerate(retrieved):
        if song in relevant:
            return 1 / (idx + 1)
    return 0


# Compute NDCG@K
def ndcg_at_k(retrieved, relevant, k=10):
    y_true = [1 if song in relevant else 0 for song in retrieved[:k]]
    y_score = [1] * len(y_true)  # Assume all retrieved items have the same score
    return ndcg_score([y_true], [y_score], k=k)


# Beyond-Accuracy Metrics
def beyond_accuracy_metrics(
    query_indices,
    dataset,
    feature_columns=None,
    metrics=None,
    tags_column=None,
    popularity_column=None,
    N=10,
    weight_threshold=60,
):
    """
    Compute beyond-accuracy metrics: Coverage, Diversity, and Popularity for similarity metrics and/or a random baseline.

    Args
    ----
        query_indices: list
            List of indices for query songs in the dataset.
        dataset: pandas.DataFrame
            Full dataset containing features for similarity computation.
        feature_columns: list or None
            List of columns corresponding to feature embeddings. Set to None for random baseline.
        metrics: list or None
            List of similarity metrics to evaluate (e.g., ['cosine', 'euclidean']). Set to None for random baseline.
        tags_column: str
            Name of the column containing tags for diversity calculation.
        popularity_column: str
            Name of the column containing popularity values for popularity calculation.
        N: int
            Number of top results to retrieve.
        weight_threshold: int
            Minimum weight for a tag to be considered in the diversity calculation.



    Returns
    -------
        dict
            Coverage, Diversity, and Popularity metrics for each similarity metric or baseline.
    """
    # Initialize results container
    results = {}

    def compute_metrics(retrieved_songs):
        """Helper function to compute diversity and popularity metrics."""
        # Coverage: Track retrievable IDs
        retrievable_ids.update(retrieved_songs)

        # Diversity: Calculate the ratio of unique tags among retrieved songs to total tags in retrieved songs
        retrieved_tags_dicts = dataset[dataset["id"].isin(retrieved_songs)][tags_column]
        unique_tags = set()
        total_tags_in_retrieved = 0

        for tags_dict in retrieved_tags_dicts:
            for tag, weight in tags_dict.items():
                if weight >= weight_threshold:
                    unique_tags.add(tag)
                    total_tags_in_retrieved += 1

        normalized_diversity = (
            len(unique_tags) / total_tags_in_retrieved
            if total_tags_in_retrieved > 0
            else 0
        )

        # Popularity: Compute normalized average popularity of retrieved songs
        avg_popularity = dataset[dataset["id"].isin(retrieved_songs)][
            popularity_column
        ].mean()
        normalized_popularity = (
            (avg_popularity - min_popularity) / (max_popularity - min_popularity)
            if max_popularity > min_popularity
            else 0
        )

        return normalized_diversity, normalized_popularity

    min_popularity = dataset[popularity_column].min()
    max_popularity = dataset[popularity_column].max()

    # Check for random baseline
    if feature_columns is None:
        retrievable_ids = set()
        results["random"] = {f"Cov@N": 0, f"Div@N": 0, f"AvgPop@N": 0}

        for query_index in tqdm(
            query_indices, desc="Processing queries for Random Baseline"
        ):
            query_song = dataset.iloc[query_index]
            retrieved_songs = random_baseline(query_song, dataset, N)["id"].tolist()
            diversity, popularity = compute_metrics(retrieved_songs)

            results["random"][f"Div@N"] += diversity
            results["random"][f"AvgPop@N"] += popularity

        # Finalize random baseline results
        total_songs = len(dataset)
        results["random"][f"Cov@N"] = len(retrievable_ids) / total_songs
        results["random"][f"Div@N"] /= len(query_indices)
        results["random"][f"AvgPop@N"] /= len(query_indices)

        return results

    # Process similarity metrics for IR systems
    for metric in metrics:
        retrievable_ids = set()
        results[metric] = {f"Cov@N": 0, f"Div@N": 0, f"AvgPop@N": 0}

        for query_index in tqdm(
            query_indices, desc=f"Processing queries for {metric} metric"
        ):
            query_song = dataset.iloc[query_index]
            retrieved_songs = retrieve_n_songs_by_similarity(
                query_song, dataset, feature_columns, metric, N
            )["id"]
            diversity, popularity = compute_metrics(retrieved_songs)

            results[metric][f"Div@N"] += diversity
            results[metric][f"AvgPop@N"] += popularity

        # Finalize metric-specific results
        total_songs = len(dataset)
        results[metric][f"Cov@N"] = len(retrievable_ids) / total_songs
        results[metric][f"Div@N"] /= len(query_indices)
        results[metric][f"AvgPop@N"] /= len(query_indices)

    return results


def evaluate_metrics(query_song, dataset, feature_columns, metric, N=10):
    """
    Evaluate retrieval performance for a given similarity metric.

    Args
    ----
        query_song
            The query song (row) from the dataset.
        dataset
            Full dataset containing features for similarity computation.
        feature_columns
            List of columns corresponding to feature embeddings.
        metric
            Similarity metric to evaluate ('cosine', 'euclidean').
        N
            Number of top results to retrieve.

    Returns
    -------
        dict
            Evaluation metrics (Precision@10, Recall@10, NDCG@10).
    """

    # Check for random baseline usage
    if feature_columns is None:
        retrieved_songs = random_baseline(query_song, dataset, N)["id"].tolist()
    else:
        # Retrieve top N songs
        retrieved_songs = retrieve_n_songs_by_similarity(
            query_song, dataset, feature_columns, metric, N
        )["id"]

    # Define relevance based on query song's genre
    query_tags = query_song["(tag, weight)"]  # Parse query song tags
    relevant_songs = []
    relevance_scores = {}

    for _, candidate_song in dataset.iterrows():
        candidate_tags = candidate_song["(tag, weight)"]
        # Compute Weighted Jaccard Similarity
        relevance_score = compute_weighted_jaccard(query_tags, candidate_tags)
        if relevance_score > 0:  # Only consider non-zero similarities
            relevant_songs.append(candidate_song["id"])
            relevance_scores[candidate_song["id"]] = relevance_score

    # Compute evaluation metrics
    precision = precision_at_k(retrieved_songs, relevant_songs, k=N)
    recall = recall_at_k(retrieved_songs, relevant_songs, k=N)
    ndcg = ndcg_at_k(retrieved_songs, relevant_songs, k=N)
    mrr = mean_reciprocal_rank(retrieved_songs, relevant_songs)

    return {
        f"Precision@N": precision,
        f"Recall@N": recall,
        f"NDCG@N": ndcg,
        f"MRR": mrr,
    }


def run_evaluations(query_indices, dataset, feature_columns, similarity_metrics, N=10):
    """
    Run evaluation for multiple query songs and compute average metrics.

    Args
    ----
        query_indices
            List of indices for query songs in the dataset.
        dataset
            Full dataset containing features for similarity computation.
        feature_columns
            List of columns corresponding to feature embeddings.
        metrics
            List of similarity metrics to evaluate (e.g., ['cosine', 'euclidean']).
        N
            Number of top results to retrieve.

    Returns
    -------
        dict
            Average evaluation metrics for each similarity metric.
    """
    results = {
        metric: {f"Precision@N": 0, f"Recall@N": 0, f"NDCG@N": 0, "MRR": 0}
        for metric in similarity_metrics
    }

    for query_index in query_indices:
        query_song = dataset.iloc[query_index]
        for metric in similarity_metrics:
            eval_metrics = evaluate_metrics(
                query_song, dataset, feature_columns, metric, N
            )
            for key in eval_metrics:
                results[metric][key] += eval_metrics[key]

    # Compute averages
    num_queries = len(query_indices)
    for metric in similarity_metrics:
        for key in results[metric]:
            results[metric][key] /= num_queries

    return results
