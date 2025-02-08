# This is an example of a simple Flask server that serves a TSV file and a JSON file.


# from flask import Flask, jsonify, send_from_directory
# import os, json

# app = Flask(__name__)

# DATA_DIR = "data"


# @app.route("/api/dataset")
# def get_dataset():
#     # Return the TSV file as text
#     return send_from_directory(
#         DATA_DIR, "merged_dataset.tsv", mimetype="text/tab-separated-values"
#     )


# @app.route("/api/cache")
# def get_cache():
#     # Return the JSON content
#     with open(os.path.join(DATA_DIR, "fb5d6.json"), "r") as f:
#         data = json.load(f)
#     return jsonify(data)


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)
