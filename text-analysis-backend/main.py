from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from textblob import TextBlob
import time
from datetime import datetime
import nltk # (update for backend on Docker)
import csv
import os
# IMPORT FROM FILES
from main_binoculars import analyze_binoculars
from models import db, Individual

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})

# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:h@ppyAI42@localhost/admin_'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:h%40ppyAI42@localhost:3306/admin_'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['SQLALCHEMY_DATABASE_URI'] = (
f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}"
f"@{os.getenv('MYSQL_HOST')}:3306/{os.getenv('MYSQL_DB')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# db = SQLAlchemy(app)
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)

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

now = datetime.now() # current date and time
date_time = now.strftime("%m/%d/%Y, %H:%M:%S")
print("++"+date_time+"++ Set up with host 0.0.0.0")

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
        # print("___ response: ",response)
        # print(type(response))
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


@app.route('/api/test_list_individuals', methods=['GET'])
def test_list_individuals():
    individuals = Individual.query.all()
    if not individuals:
        default_individuals = [
            ("Alice", "Black"), ("Bob", "Vance"), ("Charlie", "Meyers"), ("David", "Wallace"),
            ("Ethan", "Drake"), ("Francis", "Croshaw"), ("Gale", "Grimm"), ("Hugo", "Martin"),
            ("Ines", "Arabelle"), ("Julian", "Johnson"), ("Karim", "Smith"), ("Leo", "Lionel"),
            ("Maxim", "Romero")
        ]
        for first_name, last_name in default_individuals:
            new_individual = Individual(first_name=first_name, last_name=last_name)
            db.session.add(new_individual)
        db.session.commit()
        individuals = Individual.query.all()
    result = [{"id": ind.id, "first_name": ind.first_name, "last_name": ind.last_name} for ind in individuals]
    return jsonify(result)

@app.route('/api/individuals/<individual_id>/files', methods=['GET'])
def get_individual_files(individual_id):
    individual = Individual.query.get(individual_id)
    if individual is None:
        return jsonify({"error": "Individual not found"}), 404
    files = File.query.filter_by(individual_id=individual_id).all()
    result = [{"id": file.id, "filename": file.filename} for file in files]
    return jsonify(result)

@app.route('/api/individuals/<individual_id>/files', methods=['POST'])
def add_individual_file(individual_id):
    individual = Individual.query.get(individual_id)
    if individual is None:
        return jsonify({"error": "Individual not found"}), 404
    file_data = request.json
    if not file_data or 'filename' not in file_data:
        return jsonify({"error": "Invalid data"}), 400
    new_file = File(filename=file_data['filename'], individual_id=individual_id)
    db.session.add(new_file)
    db.session.commit()
    return jsonify({"id": new_file.id, "filename": new_file.filename}), 201



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)   
    # app.run(debug=True, port=int("5000"))
