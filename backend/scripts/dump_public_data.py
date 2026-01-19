import os
import json
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Add parent directory to path to import app modules if needed
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_KEY must be set in .env")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Tables containing "public" data (no sensitive user info)
TABLES_TO_EXPORT = [
    "modules",
    "module_offerings",
    "exchange_modules",
    "reviews" 
]

OUTPUT_FILE = os.path.join(os.path.dirname(__file__), '../seeds/public_data.json')

def fetch_sample_rows(table_name, limit=5):
    print(f"Fetching sample {limit} rows from {table_name}...")
    try:
        response = supabase.table(table_name).select("*").limit(limit).execute()
        return response.data
    except Exception as e:
        print(f"Error fetching {table_name}: {e}")
        return []

def main():
    print("Starting public data sample dump...")
    full_dump = {}
    
    for table in TABLES_TO_EXPORT:
        full_dump[table] = fetch_sample_rows(table, limit=5)
        
    # Create seeds directory if it doesn't exist
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        
    print(f"Writing data to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(full_dump, f, indent=2, sort_keys=True)
        
    print("Dump complete!")

if __name__ == "__main__":
    main()
