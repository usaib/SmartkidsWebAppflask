from flask import Flask, request, render_template, jsonify ,json,redirect, request, url_for

from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import join,desc
from sqlalchemy.sql import select
import firebase_admin
from firebase_admin import messaging
from firebase_admin import credentials
from flask_login import LoginManager,login_user,login_required,UserMixin,logout_user,current_user

cred = credentials.Certificate('admin.json')
default_app = firebase_admin.initialize_app(cred)


app=Flask(__name__)
login_manager=LoginManager()
login_manager.init_app(app)
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["CORS_SUPPORTS_CREDENTIALS"]=True
app.config[ "CORS_ALLOW_HEADERS"]=True
app.config['SQLALCHEMY_DATABASE_URI']='mysql://root:''@localhost/flaskcrud'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
app.config['SECRET_KEY']='topsecret'
db=SQLAlchemy(app)
ma=Marshmallow(app)
engine = create_engine('mysql://root:''@localhost/flaskcrud', echo=True)
Base = declarative_base(engine)


class sections(Base):
    __tablename__ = 'sections'
    __table_args__ = {'autoload': True}
class class_sec_bridge(Base):
    __tablename__ = 'class_sec_bridge'
    __table_args__ = {'autoload': True}
class students(Base):
    __tablename__ = 'students'
    __table_args__ = {'autoload': True}
class Notifications(Base):
    __tablename__ = 'notifications'
    __table_args__ = {'autoload': True}
class students_notifications_bridge(Base):
    __tablename__ = 'students_notifications_bridge'
    __table_args__ = {'autoload': True}
class credentials(Base):
    __tablename__ = 'credentials'
    __table_args__ = {'autoload': True}


class classes(Base):
    __tablename__ = 'classes'
    __table_args__ = {'autoload':True}
def loadSession():
    metadata = Base.metadata
    Session = sessionmaker(bind=engine)
    session = Session()
    return session

class Credentials(UserMixin,db.Model):
    id=db.Column(db.Integer,primary_key=True,autoincrement=False)
    userid=db.Column(db.String(255))
    userpass=db.Column(db.String(255))

    def __init__(self,id,userid,userpass):
        self.id=id
        self.userid=userid
        self.userpass=userpass

class StudentsSchema(ma.Schema):
    class Meta:
        fields=('Roll_Number','Name','Father Name','Phone','Cnic Number')
class CredentialSchema(ma.Schema):
    class Meta:
        fields=('id','userid','userpass')
class Classeschema(ma.Schema):
    class Meta:
        fields=('class_name','roman_name')
class Sectionschema(ma.Schema):
    class Meta:
        fields=('sec_name',)
class Class_Sectionschema(ma.Schema):
    class Meta:
        fields=('class_id','sec_id','room_no','strength',"class_sec_bridge_id")
class Class_sec_schema(ma.Schema):
    class Meta:
        fields=("class_sec_bridge_id",'roman_name','sec_name')
class Notifications_schema(ma.Schema):
    class Meta:
        fields=("notification_title",'description','notification_time')

sectionschema=Sectionschema(many=True)
classes_schema=Classeschema(many=True)
student_schema=StudentsSchema()
students_schema=StudentsSchema(many=True)
credentialschema=CredentialSchema()
class_sec_schema=Class_Sectionschema(many=True)
classes_sections_schema=Class_sec_schema(many=True)
notification_schema=Notifications_schema(many=True)

def send_to_topic():
    # [START send_to_topic]
    # The topic name can be optionally prefixed with "/topics/".
    topic = 'general'

    # See documentation on defining a message payload.
    message = messaging.Message(
        data={
            'score': '850',
            'time': '2:45',
        },
        topic=topic,
    )

    # Send a message to the devices subscribed to the provided topic.
    response = messaging.send(message)
    # Response is a message ID string.
    print('Successfully sent message:', response)
    # [END send_to_topic]


def send_to_token():
    # [START send_to_token]
    # This registration token comes from the client FCM SDKs.
    registration_token = "dtlcam7ZQfO6E51Et-jtqZ:APA91bH3Q-JeXrpMeouOFOod5RSxOaJZ51WtxoHUInQEXptCP03wf7kzG0fDvmR7kSMOsgjJZ1Q4RePWExuy87Bg27Vv-dGz0BRCvifdE2eW8aZ6fX8mJaF7BgPGsBX0YEBziYdzyza4"

    # See documentation on defining a message payload.
    message = messaging.Message(
        data={
            'score': '850',
            'time': '2:45',
        },
        token=registration_token,
    )

    # Send a message to the device corresponding to the provided
    # registration token.
    response = messaging.send(message)
    # Response is a message ID string.
    print('Successfully sent message:', response)




@login_manager.user_loader
def load_user(user_id):
    return Credentials.query.get(int(user_id))

@app.route('/')
def login():
    logout_user()
    return render_template('login.html')
@app.route('/index',methods=['GET','POST'])
def index():

    if request.method=='POST':
        uid = request.form['username']
        passwd = request.form['password']
        results = Credentials.query.filter(Credentials.userid == uid, Credentials.userpass == passwd).first()
        if results:
              login_user(results)
              return redirect(url_for('index'))
        else:
              return jsonify({'error': 'Authorization Failed'}), 401
    if current_user.is_authenticated:
        return render_template('index.html'), 200
    else:
        return jsonify({'error': 'Authorization Failed'}), 401

@app.route('/index2')
@login_required
def index2():
    return render_template('index2.html')
@app.route('/index3')
@login_required
def index3():
    return render_template('index3.html')

@app.route('/notification_panel')
@login_required
def render_notifications():
    return render_template('notification_panel.html')
@app.route('/list_of_notifications')
@login_required
def list_notifications():
    return render_template('list_of_notifications.html')
@app.route('/all')
@login_required
def reg_all():
    return render_template('all.html')

def add_credentials():
    sname = request.form['name']
    sphone= request.form['phone']
    session=loadSession()
    student =session.query(students).filter(students.Phone==sphone,students.Name==sname).first()
    sid=student.Roll_Number
    uid = 'ST-'+request.form['name']+sphone[7:11]
    upass= request.form['name']+'123'
    new_cred=Credentials(sid,uid,upass)
    db.session.add(new_cred)
    db.session.commit()
@app.route('/createclass',methods=['POST'])
def create_class():
    class_id=request.form['class_id']
    class_name=request.form['class_name']
    roman_name=request.form['roman_name']
    session = loadSession()
    session.add(classes(class_id=class_id, class_name=class_name, roman_name=roman_name))
    session.commit()
    session.close()
    return True

@app.route('/createsection',methods=['POST'])
def create_section():
    sec_id=request.form['sec_id']
    sec_name=request.form['sec_name']
    session = loadSession()
    session.add(sections(sec_id=sec_id, sec_name=sec_name))
    session.commit()
    session.close()
    return True

@app.route('/create_notification',methods=['POST'])
def create_notifications():
    time=request.form.get('time')
    title=request.form.get('title')
    description=request.form.get('description')
    session=loadSession()
    students_id = request.form.getlist('checks[]')
    session.add(Notifications(notification_title=title, description=description,notification_time=time))
    session.commit()
    new_session = loadSession()
    result=new_session.query(Notifications).filter(Notifications.notification_title==title,Notifications.notification_time==time,Notifications.description==description)
    notif_id=result[0].notification_id
    for i in range(len(students_id)):
        new_session.add(students_notifications_bridge(notification_id=notif_id,student_id=students_id[i]))
    new_session.commit()
    session.close()
    new_session.close()
    notif_session=loadSession()
    registration_tokens = []
    print(students_id)
    print(students_id)
    for i in range(len(students_id)):
        cred_data=notif_session.query(credentials).filter(credentials.id == students_id[i])
        registration_tokens.append(cred_data[0].Token)
    message = messaging.MulticastMessage(
        data={'score': title, 'time': description},
        tokens=registration_tokens,
    )
    response = messaging.send_multicast(message)
    if response.failure_count > 0:
        responses = response.responses
        failed_tokens = []
        for idx, resp in enumerate(responses):
            if not resp.success:
                # The order of responses corresponds to the order of the registration tokens.
                failed_tokens.append(registration_tokens[idx])
        print('List of tokens that caused failures: {0}'.format(failed_tokens))
    notif_session.commit()
    notif_session.close()

    return jsonify({"status":200})

@app.route('/send_notification_to_all',methods=['POST'])
def send_notification_to_all():
    time = request.form.get('time')
    title = request.form.get('title')
    description = request.form.get('description')
    topic = 'general'
    message = messaging.Message(
        data={
            'score': title,
            'time': description,
        },
        topic=topic,
    )
    # Send a message to the devices subscribed to the provided topic.
    response = messaging.send(message)
    # Response is a message ID string.
    print('Successfully sent message:', response)
    session = loadSession()
    session.add(Notifications(notification_title=title, description=description, notification_time=time))
    session.commit()
    session.close()
    list_of_students=[]
    new_session=loadSession()
    for value in new_session.query(students.Roll_Number).distinct():
        list_of_students.append(value)
    third_session=loadSession()
    result = third_session.query(Notifications).filter(Notifications.notification_title == title,Notifications.notification_time==time,Notifications.description==description)
    notif_id = result[0].notification_id
    for i in range(len(list_of_students)):
        third_session.add(students_notifications_bridge(notification_id=notif_id, student_id=list_of_students[i][0]))
    third_session.commit()
    new_session.commit()
    third_session.close()
    new_session.close()
    return jsonify({"status":200})












@app.route('/classname',methods=['POST'])
def classname():
    class_id = request.form.get('class_id')
    room_no = request.form['room_no']
    sec_id= request.form['sec_id']
    strength=request.form['strength']
    class_sec_bridge_id = request.form['class_sec_bridge_id']
    session = loadSession()
    session.add(class_sec_bridge(class_id=class_id, sec_id=sec_id, room_no=room_no,strength=strength,class_sec_bridge_id=class_sec_bridge_id))
    session.commit()
    session.close()
    return True
@app.route('/displayclassessec',methods=['GET'])
def display_classes_sec():
    session= loadSession()
    data=session.execute('SELECT sec_name , roman_name , class_sec_bridge_id FROM sections s JOIN class_sec_bridge t ON s.sec_id=t.sec_id JOIN classes c ON t.class_id=c.class_id')
    result=classes_sections_schema.dump(data)
    return jsonify(result)

@app.route('/getnotifications/<id>',methods=['GET'])
def get_notifications(id):
    session = loadSession()
    data = session.execute('SELECT notifications.notification_title,notifications.description,notifications.notification_time FROM notifications JOIN students_notifications_bridge ON students_notifications_bridge.notification_id = notifications.notification_id WHERE students_notifications_bridge.student_id ='+id+' ORDER BY notifications.notification_id DESC')
    result=notification_schema.dump(data)
    return jsonify({"notifications":result})

@app.route('/getclasses',methods=['GET'])
def getclasses():
    session = loadSession()
    all_classes =session.query(classes).all()
    result=classes_schema.dump(all_classes)
    return jsonify(result)

@app.route('/getsections',methods=['GET'])
def getsections():
    session = loadSession()
    all_sections =session.query(sections).all()
    result=sectionschema.dump(all_sections)
    return jsonify(result)

@app.route('/getclass_sec',methods=['GET'])
def getclass_sec():
    session = loadSession()
    all_class_sec =session.query(class_sec_bridge).all()
    result=class_sec_schema.dump(all_class_sec)
    return jsonify(result)
@app.route('/getstudentbyclass/<id>',methods=['GET'])
def get_student_by_class(id):
    session = loadSession()
    all_student_class =session.query(students).filter(students.Class==id)
    result=students_schema.dump(all_student_class)
    return jsonify(result)

@app.route('/credentials',methods=['POST'])
def check():
    uid = request.form['userid']
    passwd = request.form['userpass']
    Token=request.form['Token']
    results = Credentials.query.filter(Credentials.userid==uid,Credentials.userpass==passwd).first()
    session=loadSession()
    new_cred = session.query(credentials).filter(credentials.userid == uid,credentials.userpass==passwd)
    new_cred[0].Token=Token
    session.commit()
    session.close()
    if results:
        return credentialschema.jsonify(results),200
    else:
        return jsonify({'error':True}), 401

@app.route('/students',methods=['POST'])
def add_student():
    session = loadSession()
    name=request.form['name']
    fathername = request.form['fathername']
    phone=request.form['phone']
    class_sec_bridge_id=request.form['class_sec']
    cnic=request.form['cnic']
    data={'Name':name,'Father Name':fathername,'Phone':phone,'Class':class_sec_bridge_id,'Cnic Number':cnic}
    new_student=students(**data)
    session.add(new_student)
    session.commit()
    add_credentials()
    return student_schema.jsonify(new_student)

@app.route('/student/<id>',methods=['GET'])
def get_student(id):
    session=loadSession()
    student=session.query(students).filter(students.Roll_Number==id)
    json=students_schema.dump(student)
    return jsonify(json)
@app.route('/allstudents',methods=['GET'])
def get_allstudents():
    session=loadSession()
    all_students=session.query(students).all()
    result=students_schema.dump(all_students)
    return jsonify(result)

@app.route('/updatestudent/<id>',methods=['PUT'])
def update_student(id):

    name=request.form.get('newname')
    newfathername = request.form.get('newfathername')
    phone=request.form.get('newphone')
    cnic=request.form.get('newcnic')
    session = loadSession()
    student=session.query(students).filter(students.Phone==id).update({"Name":name,"Father Name":newfathername,"Phone":phone,"Cnic Number":cnic})
    session.commit()
    return student_schema.jsonify(student)

@app.route('/delstudent/<id>',methods=['DELETE'])
def delete_student(id):
    session=loadSession()
    student=session.query(students).get(id)
    session.delete(student)
    session.commit()
    return student_schema.jsonify(student)
@app.route('/delclass/<id>',methods=['DELETE'])
def delete_class(id):
    session = loadSession()
    cls = session.query(classes).get(id)
    session.delete(cls)
    session.commit()
    session.close()
    result = classes_schema.dump(cls)
    return jsonify(result)
@app.route('/registerdstudents',methods=['GET'])
def reg_students():
    session=loadSession()
    result = session.execute("SELECT id,userid,userpass FROM credentials WHERE Token IS NOT NULL OR Token = ' '")
    session.commit()
    session.close()
    return json.dumps([dict(r) for r in result])


@app.route('/delsec/<id>',methods=['DELETE'])
def delete_sec(id):
    session = loadSession()
    sec = session.query(sections).get(id)
    session.delete(sec)
    session.commit()
    session.close()
    result = sectionschema.dump(sec)
    return jsonify(result)


@app.route('/delclasssec/<id>',methods=['DELETE'])
def delete_class_sec(id):
    session = loadSession()
    class_sec = session.query(class_sec_bridge).get(id)
    session.delete(class_sec)
    session.commit()
    session.close()
    result = class_sec_schema.dump(class_sec)
    return jsonify(result)

@app.route('/updateclasssec/<id>',methods=['PUT'])
def update_class_sec(id):
    session = loadSession()
    cls = session.query(class_sec_bridge).get(id)
    new_class_id = request.form.get('new_class_id')
    new_room_no = request.form['new_room_no']
    new_sec_id = request.form['new_sec_id']
    new_strength = request.form['new_strength']

    cls.class_id=new_class_id
    cls.room_no=new_room_no
    cls.sec_id=new_sec_id
    cls.strength=new_strength


    session.commit()
    session.close()
    return jsonify(class_sec_schema.dump(cls))





if __name__=='__main__':
    app.run(debug=True,host='0.0.0.0')
