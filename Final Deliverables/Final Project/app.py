from flask import Flask, render_template, session, request, redirect,make_response
import ibm_db
from ibm_db2_connect import db2
import news
import json
app = Flask(__name__)
app.secret_key = "secret_key"


@app.route('/', methods=['GET', 'POST'])
def index():
    if session.get('logged_in'):
        return render_template('home.html')
    return render_template('index.html')


@app.route('/login',methods=['POST'])
def login():
    form_user = request.form['username']
    session['logged_in']=form_user
    return redirect('/')

@app.route('/loginvalidate',methods=['POST','GET'])
def loginvalidate():
    conn = db2.get_conn()
    data=request.get_json();
    form_user = data['email']
    form_password = data['password']
    sql = 'SELECT username from user WHERE mail=? and password=?'
    stmt = ibm_db.prepare(conn, sql)
    ibm_db.bind_param(stmt, 1, form_user)
    ibm_db.bind_param(stmt, 2, form_password)
    ibm_db.execute(stmt)
    account = ibm_db.fetch_assoc(stmt)
    if account:
        response = make_response('success',200)
    else:
        response = make_response('failure',200)
    response.mimetype = "text/plain"
    return  response

@app.route('/register',methods=['POST'])
def register():
    try:
        conn = db2.get_conn()
        data=request.get_json();
        form_user = data['username']
        form_password = data['password']
        form_mail = data['mail']
        form_phone = data['phone']
        sql = 'insert into user values(?,?,?,?)'
        stmt = ibm_db.prepare(conn, sql)
        ibm_db.bind_param(stmt, 1, form_user)
        ibm_db.bind_param(stmt, 2, form_password)
        ibm_db.bind_param(stmt, 3, form_mail)
        ibm_db.bind_param(stmt, 4, form_phone)
        ibm_db.execute(stmt)
        response = make_response('success',200)
    except Exception as e:
        response = make_response('failure',200)
        print(e)
    return response

@app.route('/checkForExistingUser',methods=['POST'])
def checkForExistingUser():
    conn = db2.get_conn()
    data=request.get_json();
    email=data['email'];
    print(email)
    sql = 'SELECT mail from user WHERE mail=?'
    stmt = ibm_db.prepare(conn, sql)
    ibm_db.bind_param(stmt, 1, email)
    ibm_db.execute(stmt)
    account = ibm_db.fetch_assoc(stmt)
    print(account)
    if account:
         response = make_response('true',200)
    else:
        response = make_response('false',200)
    response.mimetype = "text/plain"
    return  response


@app.route('/search',methods=['POST'])
def getNews():
    getRequests=request.get_json()
    articles=news.getNews(getRequests)
    # print(json.dumps(articles))
    response = make_response(json.dumps(articles),200)
    response.mimetype="text"
    return response


@app.route('/logout')
def logout():
    session.clear()
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True, port=5002)