import os
import sqlite3
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEFAULT_DB_PATH = os.path.join(BASE_DIR, "backend", "database", "ugc_net.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "backend", "database", "schema.sql")

def get_db_connection(db_path: str = None) -> sqlite3.Connection:
    """Returns a connection to the SQLite database with Row factory."""
    path = db_path if db_path else DEFAULT_DB_PATH
    os.makedirs(os.path.dirname(path), exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db(conn: sqlite3.Connection = None) -> None:
    """Initializes the database using schema.sql."""
    close_after = False
    if conn is None:
        conn = get_db_connection()
        close_after = True
    
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    
    conn.executescript(schema_sql)
    conn.commit()
    
    if close_after:
        conn.close()

if __name__ == "__main__":
    conn = get_db_connection()
    init_db(conn)
    print("Database initialized successfully at:", DEFAULT_DB_PATH)
    conn.close()
