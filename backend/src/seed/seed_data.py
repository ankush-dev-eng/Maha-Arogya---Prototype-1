"""
Synthetic seed data for the MahaArogya hackathon prototype.
10 hospitals in Pune with realistic departments, beds, staff, and inventory.
"""
import uuid
import random
from datetime import datetime, timedelta


def _id():
    return str(uuid.uuid4())


# ---- HOSPITALS (Pune) ----
HOSPITALS = [
    {"id": "h1", "name": "Sassoon General Hospital", "address": "Near Pune Railway Station, Sassoon Road", "city": "Pune", "latitude": 18.5204, "longitude": 73.8567, "phone": "020-26128000", "emergency_capability": True, "total_beds": 200, "status": "active", "stress_level": 0.72},
    {"id": "h2", "name": "KEM Hospital Pune", "address": "Sardar Moodliar Road, Rasta Peth", "city": "Pune", "latitude": 18.5135, "longitude": 73.8673, "phone": "020-24126300", "emergency_capability": True, "total_beds": 150, "status": "active", "stress_level": 0.55},
    {"id": "h3", "name": "Deenanath Mangeshkar Hospital", "address": "Near Mhatre Bridge, Erandwane", "city": "Pune", "latitude": 18.5089, "longitude": 73.8310, "phone": "020-49153000", "emergency_capability": True, "total_beds": 180, "status": "active", "stress_level": 0.40},
    {"id": "h4", "name": "Ruby Hall Clinic", "address": "40, Sassoon Road", "city": "Pune", "latitude": 18.5236, "longitude": 73.8725, "phone": "020-66455000", "emergency_capability": True, "total_beds": 220, "status": "active", "stress_level": 0.35},
    {"id": "h5", "name": "Jehangir Hospital", "address": "32, Sassoon Road", "city": "Pune", "latitude": 18.5260, "longitude": 73.8748, "phone": "020-66810000", "emergency_capability": True, "total_beds": 160, "status": "active", "stress_level": 0.28},
    {"id": "h6", "name": "Bharati Vidyapeeth Medical College Hospital", "address": "Pune-Satara Road, Dhankawadi", "city": "Pune", "latitude": 18.4653, "longitude": 73.8461, "phone": "020-24373788", "emergency_capability": True, "total_beds": 170, "status": "active", "stress_level": 0.48},
    {"id": "h7", "name": "Sancheti Hospital", "address": "Shivajinagar", "city": "Pune", "latitude": 18.5314, "longitude": 73.8446, "phone": "020-66037300", "emergency_capability": False, "total_beds": 120, "status": "active", "stress_level": 0.30},
    {"id": "h8", "name": "Aundh District Hospital", "address": "Aundh, Pune", "city": "Pune", "latitude": 18.5583, "longitude": 73.8073, "phone": "020-25888288", "emergency_capability": True, "total_beds": 130, "status": "active", "stress_level": 0.85},
    {"id": "h9", "name": "Command Hospital (Southern Command)", "address": "Southern Command, Wanowrie", "city": "Pune", "latitude": 18.4879, "longitude": 73.8930, "phone": "020-26823054", "emergency_capability": True, "total_beds": 190, "status": "active", "stress_level": 0.22},
    {"id": "h10", "name": "Yashwantrao Chavan Memorial Hospital", "address": "Sant Tukaram Nagar, Pimpri", "city": "Pune", "latitude": 18.6280, "longitude": 73.8003, "phone": "020-27425800", "emergency_capability": True, "total_beds": 140, "status": "overloaded", "stress_level": 0.92},
]

# ---- DEPARTMENTS ----
DEPT_TYPES = [
    ("General Medicine", "general"),
    ("Emergency", "emergency"),
    ("Cardiology", "cardiology"),
    ("Orthopedics", "orthopedics"),
    ("Pediatrics", "pediatrics"),
    ("Gynecology", "gynecology"),
    ("Surgery", "surgery"),
    ("ENT", "ent"),
    ("Ophthalmology", "ophthalmology"),
    ("Neurology", "neurology"),
    ("Dermatology", "dermatology"),
    ("Psychiatry", "psychiatry"),
]


def generate_departments():
    departments = []
    for h in HOSPITALS:
        # Each hospital gets 5-8 departments
        n_depts = random.randint(5, min(8, len(DEPT_TYPES)))
        selected = random.sample(DEPT_TYPES, n_depts)
        # Always include General Medicine and Emergency
        must_have = [("General Medicine", "general"), ("Emergency", "emergency")]
        for dept in must_have:
            if dept not in selected:
                selected.append(dept)
        for name, dtype in selected:
            departments.append({
                "id": _id(),
                "hospital_id": h["id"],
                "name": name,
                "type": dtype,
                "status": "active",
                "capacity": random.randint(10, 40),
                "current_queue": random.randint(0, 20),
                "avg_wait_minutes": random.randint(5, 45),
            })
    return departments


# ---- BEDS ----
WARDS = ["General Ward A", "General Ward B", "ICU", "Emergency", "Pediatric Ward", "Maternity"]
BED_STATES = ["available", "occupied", "occupied", "occupied", "reserved", "cleaning", "maintenance"]


def generate_beds():
    beds = []
    for h in HOSPITALS:
        total = h["total_beds"]
        bed_num = 1
        for ward in random.sample(WARDS, min(4, len(WARDS))):
            ward_beds = total // 4
            bed_type = "icu" if "ICU" in ward else ("oxygen_supported" if random.random() > 0.7 else "general")
            for _ in range(ward_beds):
                state = random.choice(BED_STATES)
                beds.append({
                    "id": _id(),
                    "hospital_id": h["id"],
                    "ward": ward,
                    "bed_number": f"{ward[0]}{bed_num:03d}",
                    "bed_type": bed_type,
                    "state": state,
                    "patient_name": random.choice(["Ramesh Patil", "Sunita Deshmukh", "Vijay Kulkarni", "Priya Joshi", "Amit Sharma", None]) if state == "occupied" else None,
                    "confirmed_at": datetime.now() if state != "available" else None,
                })
                bed_num += 1
    return beds


# ---- PATIENTS ----
PATIENTS = [
    {"id": "p1", "name": "Rajesh Patil", "age": 45, "sex": "male", "language": "mr", "phone": "9876543210", "blood_group": "B+", "allergies": '["Penicillin"]', "existing_conditions": '["Diabetes Type 2", "Hypertension"]', "medications": '["Metformin 500mg", "Amlodipine 5mg"]'},
    {"id": "p2", "name": "Sunita Deshpande", "age": 32, "sex": "female", "language": "mr", "phone": "9876543211", "blood_group": "A+", "allergies": '[]', "existing_conditions": '["Asthma"]', "medications": '["Salbutamol inhaler"]'},
    {"id": "p3", "name": "Amit Kumar Singh", "age": 58, "sex": "male", "language": "hi", "phone": "9876543212", "blood_group": "O+", "allergies": '["Sulfa drugs"]', "existing_conditions": '["Coronary Artery Disease", "Hyperlipidemia"]', "medications": '["Aspirin 75mg", "Atorvastatin 20mg", "Metoprolol 25mg"]'},
    {"id": "p4", "name": "Priya Joshi", "age": 28, "sex": "female", "language": "en", "phone": "9876543213", "blood_group": "AB+", "allergies": '[]', "existing_conditions": '[]', "medications": '[]'},
    {"id": "p5", "name": "Mohan Gavhane", "age": 67, "sex": "male", "language": "mr", "phone": "9876543214", "blood_group": "O-", "allergies": '["Ibuprofen"]', "existing_conditions": '["COPD", "Heart Failure"]', "medications": '["Furosemide 40mg", "Enalapril 5mg", "Tiotropium inhaler"]'},
    {"id": "p6", "name": "Anita Bhosale", "age": 41, "sex": "female", "language": "mr", "phone": "9876543215", "blood_group": "B-", "allergies": '[]', "existing_conditions": '["Thyroid disorder"]', "medications": '["Levothyroxine 50mcg"]'},
    {"id": "p7", "name": "Vikram Rathod", "age": 35, "sex": "male", "language": "hi", "phone": "9876543216", "blood_group": "A-", "allergies": '["Shellfish"]', "existing_conditions": '[]', "medications": '[]'},
    {"id": "p8", "name": "Sneha Kulkarni", "age": 22, "sex": "female", "language": "en", "phone": "9876543217", "blood_group": "O+", "allergies": '[]', "existing_conditions": '[]', "medications": '[]'},
]

# ---- BLOOD STOCK ----
BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]


def generate_blood_stock():
    stocks = []
    for h in HOSPITALS:
        for bg in BLOOD_GROUPS:
            units = random.randint(0, 25)
            status = "critical" if units < 3 else ("low" if units < 8 else "adequate")
            stocks.append({
                "id": _id(),
                "hospital_id": h["id"],
                "blood_group": bg,
                "units": units,
                "status": status,
            })
    return stocks


# ---- STAFF ----
DOCTOR_NAMES = ["Dr. Anil Deshmukh", "Dr. Meera Patel", "Dr. Sanjay Kulkarni", "Dr. Pooja Sharma", "Dr. Rahul Joshi", "Dr. Neha Gupta", "Dr. Vikram Rane", "Dr. Anita More"]
NURSE_NAMES = ["Nurse Rekha", "Nurse Swati", "Nurse Mangala", "Nurse Kavita", "Nurse Deepa", "Nurse Suman"]


def generate_staff():
    staff = []
    for h in HOSPITALS:
        # 4-6 doctors per hospital
        for i in range(random.randint(4, 6)):
            doc = random.choice(DOCTOR_NAMES)
            staff.append({
                "id": _id(),
                "hospital_id": h["id"],
                "name": doc,
                "role": "doctor",
                "department": random.choice(["General Medicine", "Emergency", "Cardiology", "Surgery"]),
                "specialization": random.choice(["General", "Cardiology", "Orthopedics", "Emergency Medicine", "Neurology"]),
                "availability": random.choice(["available", "available", "busy", "off_duty"]),
                "shift": random.choice(["morning", "afternoon", "night"]),
                "patient_load": random.randint(0, 8),
                "max_load": 8,
            })
        # 6-10 nurses
        for i in range(random.randint(6, 10)):
            staff.append({
                "id": _id(),
                "hospital_id": h["id"],
                "name": random.choice(NURSE_NAMES),
                "role": "nurse",
                "department": random.choice(["General Ward", "ICU", "Emergency", "OPD"]),
                "specialization": None,
                "availability": random.choice(["available", "available", "busy"]),
                "shift": random.choice(["morning", "afternoon", "night"]),
                "patient_load": random.randint(0, 12),
                "max_load": 12,
            })
    return staff


# ---- INVENTORY (medicines) ----
MEDICINES = [
    ("Paracetamol 500mg", "medicine"), ("Amoxicillin 250mg", "medicine"), ("Ibuprofen 400mg", "medicine"),
    ("Metformin 500mg", "medicine"), ("Amlodipine 5mg", "medicine"), ("Omeprazole 20mg", "medicine"),
    ("Azithromycin 500mg", "medicine"), ("Cetirizine 10mg", "medicine"), ("Salbutamol Inhaler", "medicine"),
    ("Insulin Glargine", "medicine"), ("Surgical Gloves (Box)", "consumable"), ("Syringes 5ml (Box)", "consumable"),
    ("N95 Masks (Box)", "consumable"), ("Bandages (Roll)", "consumable"), ("IV Fluid (Saline 500ml)", "consumable"),
    ("Oxygen Mask", "equipment"), ("Pulse Oximeter", "equipment"), ("BP Monitor", "equipment"),
]


def generate_inventory():
    items = []
    for h in HOSPITALS:
        for name, category in MEDICINES:
            qty = random.randint(5, 500)
            rate = random.uniform(0.5, 10.0)
            reorder = random.randint(10, 50)
            status = "critical" if qty < reorder * 0.5 else ("low" if qty < reorder else "adequate")
            items.append({
                "id": _id(),
                "hospital_id": h["id"],
                "item_name": name,
                "category": category,
                "quantity": qty,
                "unit": "tablets" if category == "medicine" else ("boxes" if "Box" in name else "units"),
                "expiry_date": (datetime.now() + timedelta(days=random.randint(30, 730))).strftime("%Y-%m-%d"),
                "consumption_rate": round(rate, 1),
                "reorder_level": reorder,
                "status": status,
            })
    return items


# ---- RESOURCES ----
RESOURCE_TYPES = [
    ("ventilator", 5, 20), ("oxygen_cylinder", 10, 50), ("ppe_kit", 20, 100),
    ("operating_theatre", 1, 5), ("x_ray_machine", 1, 4), ("ct_scanner", 1, 2),
    ("defibrillator", 2, 6), ("ecg_machine", 2, 5),
]


def generate_resources():
    resources = []
    for h in HOSPITALS:
        for rtype, min_qty, max_qty in RESOURCE_TYPES:
            total = random.randint(min_qty, max_qty)
            available = random.randint(0, total)
            status = "critical" if available == 0 else ("low" if available < total * 0.3 else "adequate")
            resources.append({
                "id": _id(),
                "hospital_id": h["id"],
                "type": rtype,
                "quantity": total,
                "available": available,
                "status": status,
            })
    return resources


def get_all_seed_data():
    """Returns all synthetic data as a dictionary."""
    random.seed(42)
    return {
        "hospitals": HOSPITALS,
        "departments": generate_departments(),
        "beds": generate_beds(),
        "patients": PATIENTS,
        "blood_stock": generate_blood_stock(),
        "staff": generate_staff(),
        "inventory": generate_inventory(),
        "resources": generate_resources(),
    }
