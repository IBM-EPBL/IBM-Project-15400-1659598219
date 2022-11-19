import smtplib
import sendgrid
import os
from sendgrid.helpers.mail import Mail, Email, To, Content
SUBJECT = "IBM Personal expense tracker"
s = smtplib.SMTP('smtp.gmail.com', 587)

def sendmail(TEXT,email):
    print("sorry we cant process your candidature")
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()
    s.login("harinish2001@gmail.com", "Harini@ibm")
    message  = 'Subject: {}\n\n{}'.format(SUBJECT, TEXT)
    s.sendmail("harinish2001@gmail.com", email, message)
    s.quit()
def sendgridmail(user,TEXT):
  
    from_email = Email("harinish2001@gmail.com") 
    to_email = To(user) 
    subject = "Limit Message"
    content = Content("text/plain",TEXT)
    mail = Mail(from_email, to_email, subject, content)
    mail_json = mail.get()
    response = sg.client.mail.send.post(request_body=mail_json)
    print(response.status_code)
    print(response.headers)
