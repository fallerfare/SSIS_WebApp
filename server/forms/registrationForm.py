from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length, EqualTo

class RegistrationForm(FlaskForm):
    username                = StringField('Username', 
                                        validators=[DataRequired(), Length(min=3, max=35)])
    password                 = PasswordField('Password', 
                                        validators=[DataRequired(), Length(min=8)])
    confirm_password    = PasswordField('Password', 
                                        validators=[DataRequired(), Length(min=8), EqualTo("password")])
    submit                     = SubmitField('Submit')
    
