from scripts.evaluation_metrics import (
    beyond_accuracy_metrics,
    evaluate_metrics,
    run_evaluations,
)
import pandas as pd


def evaluate_tradeoffs(
    query_indices,
    datasets,
    systems,
    beyond_metrics,
    beyond_tags_column,
    beyond_popularity_column,
    N=10,
):
    """
    Evaluate trade-offs between NDCG and beyond-accuracy metrics for multiple IR systems.

    Args
    ----
        query_indices
            List of indices for query songs in the datasets.
        datasets
            Dictionary mapping system names to their respective datasets.
        systems
            Dictionary mapping system names to their feature columns.
        beyond_metrics
            List of similarity metrics to evaluate (e.g., ['cosine', 'euclidean']).
        beyond_tags_column
            Name of the column containing tags for diversity.
        beyond_popularity_column
            Name of the column containing popularity scores.
        N
            Number of top results to evaluate.

    Returns
    -------
        pandas.DataFrame
            Trade-off results showing NDCG, Diversity, and Popularity for each system and metric.
    """
    results = []

    for system_name, feature_columns in systems.items():
        print(f"{system_name}:")
        dataset = datasets[system_name]

        isRandomBaseline = feature_columns is None
        if isRandomBaseline:
            ndcg_sum = 0
            precision_sum = 0
            recall_sum = 0
            for query_index in query_indices:
                query_song = dataset.iloc[query_index]
                eval_metrics = evaluate_metrics(
                    query_song, dataset, feature_columns, None, N=N
                )
                ndcg_sum += eval_metrics[f"NDCG@N"]
                precision_sum += eval_metrics[f"Precision@N"]
                recall_sum += eval_metrics[f"Recall@N"]
            # Mean NDCG of Random Baseline for all query songs
            ndcg = ndcg_sum / len(query_indices)
            precision = precision_sum / len(query_indices)
            recall = recall_sum / len(query_indices)

            beyond_scores = beyond_accuracy_metrics(
                query_indices,
                dataset,
                feature_columns,
                "random",
                tags_column=beyond_tags_column,
                popularity_column=beyond_popularity_column,
                N=N,
                weight_threshold=60,
            )

            diversity = beyond_scores["random"][f"Div@N"]
            avg_popularity = beyond_scores["random"][f"AvgPop@N"]

            results.append(
                {
                    "System": system_name,
                    "Metric": "random",
                    f"Precision@N": precision,
                    f"Recall@N": recall,
                    f"NDCG@N": ndcg,
                    f"Div@N": diversity,
                    f"AvgPop@N": avg_popularity,
                }
            )
        else:
            for metric in beyond_metrics:
                # Evaluate NDCG
                average_metric_scores = run_evaluations(
                    query_indices, dataset, feature_columns, [metric], N=N
                )
                ndcg = average_metric_scores[metric][f"NDCG@N"]
                precision = average_metric_scores[metric][f"Precision@N"]
                recall = average_metric_scores[metric][f"Recall@N"]

                # Evaluate Beyond-Accuracy Metrics
                beyond_scores = beyond_accuracy_metrics(
                    query_indices,
                    dataset,
                    feature_columns,
                    [metric],
                    tags_column=beyond_tags_column,
                    popularity_column=beyond_popularity_column,
                    N=N,
                    weight_threshold=60,
                )

                # Extract Diversity and Popularity
                diversity = beyond_scores[metric][f"Div@N"]
                avg_popularity = beyond_scores[metric][f"AvgPop@N"]

                # Append results
                results.append(
                    {
                        "System": system_name,
                        "Metric": metric,
                        f"Precision@N": precision,
                        f"Recall@N": recall,
                        f"NDCG@N": ndcg,
                        f"Div@N": diversity,
                        f"AvgPop@N": avg_popularity,
                    }
                )
        print()

    # Convert results to a DataFrame
    return pd.DataFrame(results)
