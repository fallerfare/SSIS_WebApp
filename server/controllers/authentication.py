from flask import Blueprint, jsonify
from forms.registrationForm import RegistrationForm

auth = Blueprint("auth", __name__)

# ========================== 
# SIGN UP/IN
# ==========
@auth.route("/", methods = ["POST"])
def signin():
    form = RegistrationForm()
    if form.validate_on_submit():
        return jsonify({'message' : 'Registrations is succesfull. Redirecting...'}), 200
    return jsonify({'errors': form.errors}), 400