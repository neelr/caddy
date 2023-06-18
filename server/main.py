import openai


def get_query(question: str):

  query = f"""
  Write a many keywords that I can use to query for answers to for the following question: {question}. The embedding database contains webscraped data. Do not include anything in your response other than the expansion words.
  """

  completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    temperature=0.1,
    messages=[
          {"role": "system", "content": "You write semantic search queries to embedding database"},
          {"role": "user", "content": query},
          # {"role": "assistant", "content": "
          # {"role": "user", "content": "Where was it played?"}
      ]
  )
  return completion.choices[0].message.content
# get the response and use it to query Pinecone vector db

from sentence_transformers import SentenceTransformer
import torch

device = 'cuda' if torch.cuda.is_available() else 'cpu'
if device != 'cuda':
    print(f"You are using {device}. This is much slower than using "
          "a CUDA-enabled GPU. If on Colab you can change this by "
          "clicking Runtime > Change runtime type > GPU.")

from InstructorEmbedding import INSTRUCTOR
model = INSTRUCTOR('hkunlp/instructor-base')

import os
import pinecone

# get api key from app.pinecone.io


pinecone.init(
    api_key=PINECONE_API_KEY,
    environment=PINECONE_ENV
)

index_name = 'imessage'

# only create index if it doesn't exist
if index_name not in pinecone.list_indexes():
    pinecone.create_index(
        name=index_name,
        dimension=model.get_sentence_embedding_dimension(),
        metric='cosine'
    )

# now connect to the index
index = pinecone.Index(index_name)


def query(text, k):
    res = index.query(
        vector=model.encode([["make a semantic embedding of this for queries:",text]]).tolist()[0],
        top_k=k,
        include_metadata=True,
        namespace="uno"
    )["matches"]
    return res
def qans(text, k):
    q = get_query(text)
    print(q)
    docs = query(q, k)
    print(docs)
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You write semantic search queries to embedding database",
            },
            {"role": "user", "content": f"Here is your question '{text}' use the following texts to assist in answering it: \n {docs} \n Answer the question no matter what"},
            # {"role": "assistant", "content": "
            # {"role": "user", "content": "Where was it played?"}
        ],
    )
    return docs, completion.choices[0].message.content
from sklearn.cluster import KMeans
import numpy as np

def get_similar(vector: list, index):

  rec_docs = index.query(
    vector=vector,
    top_k=3,
    include_metadata=True,
    namespace="v1"
  )

  return rec_docs['matches'][0]['id']
import requests
from bs4 import BeautifulSoup
def reccs():
    index = pinecone.Index("imessage")
    docs = index.query(
        vector=[0]*768,
        top_k=1e4,
        include_values=True,
        include_metadata=True,
        namespace="uno"
    )["matches"]
    v = []
    ids = []
    for i in docs:
        v.append(np.array(i["values"]))
        ids.append(i["id"])

    data = np.array(v)
    kmeans = KMeans(n_clusters=5) # TODO: auto find num clusters
    kmeans.fit(data)
    centroids = kmeans.cluster_centers_
    centroid_list = []

    for cluster_idx in range(kmeans.n_clusters):
        cluster_centroid = centroids[cluster_idx]
        centroid_list.append(cluster_centroid)
    # alexandria

    PINECONE_ENV = "us-central1-gcp"

    pinecone.init(
        api_key=PINECONE_API_KEY,
        environment=PINECONE_ENV
    )
    index_name = "arxiv" # "https://the-arxiv-ef40355.svc.us-central1-gcp.pinecone.io/"
    index = pinecone.Index(index_name)

    centroid_list[0].tolist()
    pv = []
    for c in centroid_list:
        id = get_similar(c.tolist(), index=index)
        pv.append(id)

    PINECONE_ENV = "asia-southeast1-gcp-free"

    pinecone.init(
        api_key=PINECONE_API_KEY,
        environment=PINECONE_ENV
    )

    # take the list of urls and scrape the title of each using beautiful soup
    urls = pv
    pv = []
    for url in urls:
        page = requests.get("https://arxiv.org/abs/"+url)
        soup = BeautifulSoup(page.content, 'html.parser')
        title = soup.find("title").text
        pv.append(title)
    return dict(zip(urls, pv))


# flask app
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/question', methods=['POST'])
@cross_origin()
def question():
    data = request.get_json()
    q = data['q']
    k = data['k']
    docs, res = qans(q, k)
    new = []
    for i in docs:
        new.append({
            "id": i["id"],
            "title": i["metadata"]["title"],
            "url": i["metadata"]["url"],
        })
    return jsonify({"data":res, "docs": new})

@app.route('/qs', methods=['POST'])
@cross_origin()
def qs():
    data = request.get_json()
    q = data['q']
    k = int(data['k'])
    res = query(q, k)
    new = []
    for i in res:
        new.append({
            "id": i["id"],
            "title": i["metadata"]["title"],
            "url": i["metadata"]["url"],
        })
    return jsonify(new)

@app.route('/reccs', methods=['GET'])
@cross_origin()
def recc():
    return jsonify(reccs())

if __name__ == '__main__':
    print("Starting server...")
    app.run(debug=True, host='localhost', port=8000)
    print("Server started")


