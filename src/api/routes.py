"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
 


api = Blueprint('api', __name__)

def set_password(password):
    return generate_password_hash(password)

def check_password(hash_password, password):
    return check_password_hash(hash_password, password)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=["POST"])
def register_user():
    body = request.json
    email = body.get("email")
    password = body.get("password")
   

    if email is None or password is None:
        return jsonify({"message":"You need to provide an email and a password"}), 400
   
    user=User.query.filter_by(email=email).one_or_none()

    if user is not None:
        return jsonify({"message":"The user already exists"}), 400
    else:
        password=set_password(password)
        user = User(email=email, password=password)

        db.session.add(user)

        try:
            db.session.commit()
            return jsonify({"message":"User created succesfully"}), 200
        except Exception as error:
            db.session.rollback()
            return jsonify({"message":f'{error}'}), 400





@api.route('/login', methods=['POST'] )
def handle_login():
    body = request.json
    email = body.get("email")
    password= body.get("password")

    if email is None or password is None:
        return jsonify({"message":"You need to provide an email and a password"}), 400 
    else:
        user = User.query.filter_by(email=email).one_or_none()
        if user is None:
            return jsonify({"message":"Login not possible the first"}), 400
        else:
            if check_password(user.password, password):
                token = create_access_token(identity = {"user_id":user.id})
                print(token)
                return jsonify({"token": token}), 200
            else:
                return jsonify({"message":"Login not possible the second"}), 400
            

@api.route ('/private', methods=['GET'])
@jwt_required()
def get_users_info():
    # token_identity= get_jwt_identity
    # if token_identity.get("role") == "admin":
    users = User.query.all()
    return jsonify(list(map(lambda item : item.serialize(), users)))