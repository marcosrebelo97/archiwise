import os

import mysql.connector
from mysql.connector import Error

# Credenciais lidas do ambiente (ver .env.example)
host = os.getenv("DB_HOST", "localhost")
port = int(os.getenv("DB_PORT", "3306"))
password = os.getenv("DB_PASSWORD", "")
database = os.getenv("DB_NAME", "archiwise")
user = os.getenv("DB_USER", "root")

class MySQLDatabase:
    def __init__(self, host=host, port=port, user=user, password=password, database=database):
        """Inicializa a conexão com o banco de dados."""
        self.config = {
            "host": host,
            "port": port,
            "user": user,
            "password": password,
            "database": database
        }
        self.connection = None

    def connect(self):
        """Estabelece a conexão com o banco de dados."""
        try:
            self.connection = mysql.connector.connect(**self.config)
            if self.connection.is_connected():
                print("Conexão bem-sucedida ao MySQL")
        except Error as err:
            print(f"Erro ao conectar ao MySQL: {err}")

    def execute_query(self, query, fetch_all=True):
        """
        Executa uma consulta SQL.
        
        """
        if self.connection is None or not self.connection.is_connected():
            self.connect()
        
        try:
            cursor = self.connection.cursor()
            cursor.execute(query)

            if query.strip().lower().startswith("select"):
                result = cursor.fetchall() if fetch_all else cursor.fetchone()
            else:
                self.connection.commit()
                result = None

            cursor.close()
            return result
        except Error as err:
            print(f"Erro ao executar a consulta: {err}")
            return None

    def close_connection(self):
        """Fecha a conexão com o banco de dados."""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("Conexão com MySQL fechada")

# Exemplo de uso
if __name__ == "__main__":
    db = MySQLDatabase()
    db.connect()

    query = "SELECT name FROM Category;"
    results = db.execute_query(query)

    if results:
        for row in results:
            print(row[0]) 
    
    db.close_connection()