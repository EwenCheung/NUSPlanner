#!/usr/bin/env python3
"""
Full Data Ingestion Script - Modules + Reviews
Runs NUSMods ingestion first, then Disqus reviews ingestion.

Usage:
    python full_ingestion.py                                   # Full ingestion
    python full_ingestion.py --threads PATH --posts PATH       # With reviews
    python full_ingestion.py --year 2025-2026                  # Specific year
    python full_ingestion.py --skip-modules                    # Only reviews
"""

import os
import sys
import argparse
import subprocess

# Default paths for review files (use latest from backend/data)
SCRIPT_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(SCRIPT_DIR, '..', 'data')
DEFAULT_THREADS = os.path.join(DATA_DIR, 'all_threads_1768473813.json')
DEFAULT_POSTS = os.path.join(DATA_DIR, 'all_posts_1768473813.json')


def run_modules_ingestion(year: str = "2025-2026"):
    """Run the NUSMods modules ingestion."""
    print(f"\n{'='*60}")
    print("STEP 1: Running NUSMods Modules Ingestion")
    print(f"{'='*60}")
    
    script_dir = os.path.dirname(__file__)
    script_path = os.path.join(script_dir, "nusmods_ingestion.py")
    
    cmd = [sys.executable, script_path, "--year", year]
    result = subprocess.run(cmd, cwd=os.path.dirname(script_dir))
    
    if result.returncode != 0:
        print("ERROR: Modules ingestion failed!")
        return False
    return True


def run_reviews_ingestion(threads_path: str, posts_path: str):
    """Run the Disqus reviews ingestion."""
    print(f"\n{'='*60}")
    print("STEP 2: Running Disqus Reviews Ingestion")
    print(f"{'='*60}")
    
    if not os.path.exists(threads_path):
        print(f"ERROR: Threads file not found: {threads_path}")
        return False
    
    if not os.path.exists(posts_path):
        print(f"ERROR: Posts file not found: {posts_path}")
        return False
    
    script_dir = os.path.dirname(__file__)
    script_path = os.path.join(script_dir, "reviews_ingestion.py")
    
    cmd = [sys.executable, script_path, "--threads", threads_path, "--posts", posts_path]
    result = subprocess.run(cmd, cwd=os.path.dirname(script_dir))
    
    if result.returncode != 0:
        print("ERROR: Reviews ingestion failed!")
        return False
    return True


def clear_tables():
    """Clear all ingestion tables."""
    from dotenv import load_dotenv
    from supabase import create_client
    
    load_dotenv()
    
    supabase = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))
    
    print("Clearing tables...")
    # Delete in order to respect foreign keys
    supabase.table('reviews').delete().neq('id', 0).execute()
    print("  ✓ Cleared reviews")
    supabase.table('module_offerings').delete().neq('id', 0).execute()
    print("  ✓ Cleared module_offerings")
    supabase.table('modules').delete().neq('module_code', '').execute()
    print("  ✓ Cleared modules")


def main():
    parser = argparse.ArgumentParser(description="Full data ingestion script")
    parser.add_argument("--year", default="2025-2026", help="Academic year for modules")
    parser.add_argument("--threads", default=DEFAULT_THREADS, help="Path to threads JSON")
    parser.add_argument("--posts", default=DEFAULT_POSTS, help="Path to posts JSON")
    parser.add_argument("--skip-modules", action="store_true", help="Skip modules ingestion")
    parser.add_argument("--skip-reviews", action="store_true", help="Skip reviews ingestion")
    parser.add_argument("--clear", action="store_true", help="Clear tables before ingestion")
    
    args = parser.parse_args()
    
    print(f"\n{'='*60}")
    print("NUS Planner Full Data Ingestion")
    print(f"{'='*60}")
    
    # Clear tables if requested
    if args.clear:
        clear_tables()
    
    # Run modules ingestion
    if not args.skip_modules:
        if not run_modules_ingestion(args.year):
            sys.exit(1)
    
    # Run reviews ingestion
    if not args.skip_reviews:
        if not run_reviews_ingestion(args.threads, args.posts):
            sys.exit(1)
    
    print(f"\n{'='*60}")
    print("Full Ingestion Complete!")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
