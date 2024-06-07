from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from textblob import TextBlob
import time
from datetime import datetime
import nltk # (update for backend on Docker)
import csv
import os

# IMPORT FROM FILES
from main_binoculars import analyze_binoculars

app = Flask(__name__)
# CORS(app)
# CORS(app, resources={r"/*": {"origins": "*"}})

# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:3000",
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})


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
    print("##analyze_text##")
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
    # CORS issues with writing in file...! (wrong file path?)
    # File path
    # csv_file_path = '/app/req_textblob_text_analysis.csv'
    # file_exists = os.path.isfile(csv_file_path)
    # Save the result in a CSV file
    # with open('/app/req_textblob_text_analysis.csv', 'a', newline='') as csvfile:
    #     writer = csv.writer(csvfile)
    #     if not file_exists:
    #         writer.writerow(["timestamp", "input_text", "polarity", "subjectivity","noun_phrases"])
    #     writer.writerow([timestamp, text, sentiment.polarity, sentiment.subjectivity, noun_phrases])
    return jsonify(response)


# test binoculars
@app.route('/api/analyze_t_b', methods=['POST'])
def analyze_text_t_b():
    try:
        print("About to call analyze_binoculars")
        data = request.json
        text = data.get('text')
        response = analyze_binoculars(text)
        print("___ response")
        print(response)
        print(type(response))
        # Convert the response to a JSON-serializable format
        response_dict = {
            "average": response[0],
            "details": [{"text": item[0], "value": float(item[1])} for item in response[1]]
        }
        print("Call of analyze_binoculars done!")
        return jsonify(response_dict)
        # return "42"
    except Exception as e:
        print("Error happened. e: ",str(e))
        return jsonify({"error": str(e)}), 500


now = datetime.now() # current date and time
date_time = now.strftime("%m/%d/%Y, %H:%M:%S")
print("++"+date_time+"++ Set up with host 0.0.0.0")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)   
    # app.run(debug=True, port=int("5000"))
