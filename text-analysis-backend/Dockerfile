# Use an official Python runtime as a base image
FROM python:3.9-slim

# # Clear any existing entrypoint
# ENTRYPOINT []

WORKDIR /app

COPY requirements.txt ./

RUN pip install -r requirements.txt
RUN pip install nltk
RUN python -m nltk.downloader brown

COPY . .
# Set the environment variable to point to your Flask application
ENV FLASK_APP=main.py

# Expose the port on which Flask runs
EXPOSE 5000

# Command to run the Flask application
CMD ["python", "./main.py"]

# From tutorial, potential alternative (https://www.youtube.com/watch?v=k704rD88NmI&t=1096s&ab_channel=MiguelGrinberg) 
# CMD ["gunicorn", "-b", ":5000", "api:app"] # they put their code in a api folder