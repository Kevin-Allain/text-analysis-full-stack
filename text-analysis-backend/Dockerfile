# Use an official Python runtime as a base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy and install the requirements
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Install additional Python packages
RUN pip install nltk
RUN python -m nltk.downloader brown

# Install Git
RUN apt-get update && apt-get install -y git

# Clone the Binoculars repository
RUN git clone https://github.com/ahans30/Binoculars.git

# Install the Binoculars package
WORKDIR /app/Binoculars
RUN pip install -e .

# Go back to the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .


# Ensure transformers is updated
#RUN pip install --upgrade transformers

# Set the environment variable to point to your Flask application
ENV FLASK_APP=main.py

# Expose the port on which Flask runs
EXPOSE 5000

# Command to run the Flask application
CMD ["python", "./main.py"]

# From tutorial, potential alternative (https://www.youtube.com/watch?v=k704rD88NmI&t=1096s&ab_channel=MiguelGrinberg) 
# CMD ["gunicorn", "-b", ":5000", "api:app"] # they put their code in a api folder