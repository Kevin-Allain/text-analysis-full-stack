from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from textblob import TextBlob
import time
from datetime import datetime
import nltk # (update for backend on Docker)
import csv
import os


app = Flask(__name__)
CORS(app)

# Issue with Docker in the backend!!! This could be an alternate point to look at https://dev.to/francescoxx/python-fullstack-rest-api-app-with-docker-1101

nltk.download('punkt') # (update for backend on Docker)

@app.route('/')
def hello_world():
    return 'Hello, World!'

#create a test route
@app.route('/api/test', methods=['GET'])
def test():
  return make_response(jsonify({'message': 'test route'}), 200)

@app.route('/api/time')
def get_current_time():
    return {'time':time.time()}

@app.route('/api/prettytime')
def get_prettytime():
    now = datetime.now() # current date and time
    date_time = now.strftime("%m/%d/%Y, %H:%M:%S")
    # print("date and time:",date_time)	
    return {'date_time':date_time}


@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    # Get the text from the request's body
    data = request.json
    text = data.get('text')
    # Perform analysis with TextBlob (or any other library)
    blob = TextBlob(text)
    sentiment = blob.sentiment
    noun_phrases = list(blob.noun_phrases)
    # Prepare the response    
    response = {
        "text": text,
        "sentiment": {
            "polarity": sentiment.polarity,
            "subjectivity": sentiment.subjectivity
        },
        "noun_phrases": noun_phrases
    }
    # Get the current timestamp
    timestamp = datetime.now().isoformat()
    # File path
    csv_file_path = '/app/req_textblob_text_analysis.csv'
    file_exists = os.path.isfile(csv_file_path)
    # Save the result in a CSV file
    with open('/app/req_textblob_text_analysis.csv', 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        if not file_exists:
            writer.writerow(["timestamp", "input_text", "polarity", "subjectivity","noun_phrases"])
        writer.writerow([timestamp, text, sentiment.polarity, sentiment.subjectivity, noun_phrases])
    return jsonify(response)

now = datetime.now() # current date and time
date_time = now.strftime("%m/%d/%Y, %H-%M-%S")
print("++"+date_time+"++ Set up with host 0.0.0.0")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)   
    # app.run(debug=True, port=int("5000"))
