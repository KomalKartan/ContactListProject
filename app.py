from flask import Flask, render_template, request, jsonify
import sqlite3
import json

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect("contacts.db")
    conn.row_factory = sqlite3.Row
    return conn

# Create table
def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,
            emails TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/contacts", methods=["GET"])
def get_contacts():
    conn = get_db()
    contacts = conn.execute("SELECT * FROM contacts").fetchall()
    conn.close()

    result = []
    for c in contacts:
        result.append({
            "id": c["id"],
            "first_name": c["first_name"],
            "last_name": c["last_name"],
            "emails": json.loads(c["emails"]) if c["emails"] else []
        })
    return jsonify(result)

@app.route("/contacts", methods=["POST"])
def add_contact():
    data = request.json
    conn = get_db()
    conn.execute(
        "INSERT INTO contacts (first_name, last_name, emails) VALUES (?, ?, ?)",
        (data["first_name"], data["last_name"], json.dumps(data["emails"]))
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Contact added"})

@app.route("/contacts/<int:id>", methods=["PUT"])
def update_contact(id):
    data = request.json
    conn = get_db()
    conn.execute(
        "UPDATE contacts SET first_name=?, last_name=?, emails=? WHERE id=?",
        (data["first_name"], data["last_name"], json.dumps(data["emails"]), id)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Updated"})

@app.route("/contacts/<int:id>", methods=["DELETE"])
def delete_contact(id):
    conn = get_db()
    conn.execute("DELETE FROM contacts WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Deleted"})

if __name__ == "__main__":
    app.run(debug=True)