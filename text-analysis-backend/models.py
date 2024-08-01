# models.py

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
import uuid

db = SQLAlchemy()

class Individual(db.Model):
    __tablename__ = 'individuals'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    files = relationship('File', backref='individual', lazy=True)

class File(db.Model):
    __tablename__ = 'files'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String(100), nullable=False)
    individual_id = Column(String(36), ForeignKey('individuals.id'), nullable=False)
