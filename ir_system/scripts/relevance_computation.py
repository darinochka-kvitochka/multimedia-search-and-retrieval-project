def compute_weighted_jaccard(query_tags, candidate_tags):
        """
        Compute the Weighted Jaccard Similarity between two tag-weight dictionaries.

        Args
        ----
            query_tags
                Dictionary of tags and weights for the query song.
            candidate_tags
                Dictionary of tags and weights for the candidate song.

        Returns
        -------
            float
                Weighted Jaccard Similarity score.
        """
        intersection = sum(min(query_tags.get(tag, 0), candidate_tags.get(tag, 0)) for tag in set(query_tags.keys()) & set(candidate_tags.keys()))
        union = sum(max(query_tags.get(tag, 0), candidate_tags.get(tag, 0)) for tag in set(query_tags.keys()) | set(candidate_tags.keys()))

        return intersection / union if union > 0 else 0