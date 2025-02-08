import random
import pandas as pd

def random_baseline(query_song, dataset, random_state: int = 42, N=10):
    """
    Generate a random list of N songs excluding the query song.
    Internally keep 'id', but exclude it in the output display.
    """
    filtered_dataset = dataset[dataset['id'] != query_song['id']].sample(frac=1, random_state=random_state)
    return filtered_dataset.head(N)