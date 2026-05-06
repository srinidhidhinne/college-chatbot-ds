import json
import os

BASE = "DataFolder"

def load_json(file):
    try:
        with open(os.path.join(BASE, file), "r") as f:
            return json.load(f)
    except:
        return {}

def get_all_data():
    return {
        "attendance": load_json("attendance.json"),
        "marks": load_json("marks.json"),
        "exams": load_json("exams.json"),
        "notes": load_json("notes.json"),
        "clubs": load_json("clubs.json"),
        "faqs": load_json("faqs.json"),
        "profile": load_json("profile.json"),
    }