import ibm_db
import config as c
class db2:
    connectionString="DATABASE={0};HOSTNAME={1};PORT={2};SECURITY={3};SSLServerCertificate={4};UID={5};PWD={6}".format(c.DATABASE,c.HOSTNAME,c.PORT,c.SECURITY,c.SSLServerCertificate,c.UID,c.PWD)
    conn = ibm_db.connect(connectionString,'','')
    def get_conn():
        return db2.conn