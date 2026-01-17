#!/usr/bin/env python3
"""
Reviews Ingestion Script - Load Disqus reviews into Supabase

This script loads pre-downloaded Disqus data (threads and posts) and 
inserts them into the reviews table, linking to modules.

Data structure:
- Threads: Each thread represents a module's review page
  - identifiers[0] = module code (e.g., "CS2030")
  - id = thread ID for linking posts
  
- Posts: Each post is a user review
  - thread = thread ID (foreign key to threads)
  - raw_message = review content
  - author.name = author display name
  - createdAt = review timestamp
  - likes, dislikes = vote counts

Usage:
    python reviews_ingestion.py --threads /path/to/threads.json --posts /path/to/posts.json
    python reviews_ingestion.py --limit 100  # Limit reviews for testing
"""

import os
import sys
import json
import argparse
import re
from typing import Dict, List, Any, Optional
from datetime import datetime

from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def load_json_file(filepath: str) -> List[Dict]:
    """Load a JSON file and return its contents."""
    print(f"Loading {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"  Loaded {len(data)} items")
    return data


def build_thread_to_module_map(threads: List[Dict]) -> Dict[str, str]:
    """Build a mapping from thread ID to module code."""
    thread_map = {}
    for thread in threads:
        thread_id = thread.get('id')
        identifiers = thread.get('identifiers', [])
        if thread_id and identifiers:
            # First identifier is usually the module code
            module_code = identifiers[0].strip().upper()
            # Validate module code format (letters followed by numbers, optional letters)
            if re.match(r'^[A-Z]{2,4}\d{4}[A-Z]*$', module_code):
                thread_map[thread_id] = module_code
    
    print(f"  Built thread->module map with {len(thread_map)} entries")
    return thread_map


def clean_html_message(text: str) -> str:
    """Clean HTML tags from message text."""
    # Remove HTML tags
    clean = re.sub(r'<[^>]+>', '', text)
    # Replace HTML entities
    clean = clean.replace('&amp;', '&')
    clean = clean.replace('&lt;', '<')
    clean = clean.replace('&gt;', '>')
    clean = clean.replace('&quot;', '"')
    clean = clean.replace('&#39;', "'")
    clean = clean.replace('&nbsp;', ' ')
    # Clean up whitespace
    clean = ' '.join(clean.split())
    return clean.strip()


def insert_reviews(posts: List[Dict], thread_map: Dict[str, str], limit: Optional[int] = None):
    """Insert reviews into the database."""
    print(f"\nInserting reviews...")
    
    success_count = 0
    error_count = 0
    skipped_count = 0
    
    # Filter posts that have a valid thread mapping
    valid_posts = []
    for post in posts:
        thread_id = post.get('thread')
        if thread_id and str(thread_id) in thread_map:
            if not post.get('isDeleted') and not post.get('isSpam'):
                valid_posts.append(post)
    
    print(f"  Found {len(valid_posts)} valid posts to insert")
    
    if limit:
        valid_posts = valid_posts[:limit]
        print(f"  Limited to {limit} posts for testing")
    
    total = len(valid_posts)
    
    for i, post in enumerate(valid_posts, 1):
        if i % 100 == 0 or i == 1:
            print(f"  Progress: {i}/{total} | Success: {success_count} | Errors: {error_count} | Skipped: {skipped_count}")
        
        try:
            thread_id = str(post.get('thread'))
            module_code = thread_map.get(thread_id)
            
            if not module_code:
                skipped_count += 1
                continue
            
            # Get review content
            raw_message = post.get('raw_message', '') or post.get('message', '')
            if not raw_message or len(raw_message) < 10:
                skipped_count += 1
                continue
            
            # Clean the message
            content = clean_html_message(raw_message)
            if len(content) < 10:
                skipped_count += 1
                continue
            
            # Get author info
            author = post.get('author', {})
            author_name = author.get('name', 'Anonymous')
            author_id = author.get('id', '')
            
            # Get timestamps
            created_at = post.get('createdAt')
            
            # Build review record (matching existing schema)
            review_data = {
                'module_code': module_code,
                'comment': content[:5000],  # Review content (limit length)
                'rating': None,  # Disqus doesn't have ratings
                'source': 'Disqus',
                'academic_year': extract_academic_year(content),
                'disqus_post_id': str(post.get('id', '')),
                'timestamp': created_at
            }
            
            # Upsert to avoid duplicates (using disqus_post_id)
            supabase.table('reviews').upsert(
                review_data, 
                on_conflict='disqus_post_id'
            ).execute()
            
            success_count += 1
            
        except Exception as e:
            error_count += 1
            if error_count < 5:
                print(f"    Error inserting review: {str(e)[:80]}")
    
    print(f"\n  Final: Success: {success_count} | Errors: {error_count} | Skipped: {skipped_count}")
    return success_count, error_count


def extract_academic_year(content: str) -> Optional[str]:
    """Try to extract academic year from review content."""
    # Look for patterns like "AY23/24", "AY 23/24", "AY2023/2024"
    patterns = [
        r'AY\s*(\d{2})/(\d{2})',
        r'AY\s*(\d{4})/(\d{4})',
        r'AY\s*(\d{4})/(\d{2})',
        r'(\d{4})/(\d{4})\s*Sem',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, content, re.IGNORECASE)
        if match:
            year1, year2 = match.groups()
            if len(year1) == 2:
                year1 = f"20{year1}"
            if len(year2) == 2:
                year2 = f"20{year2}"
            return f"{year1}/{year2}"
    
    return None


def extract_semester(content: str) -> Optional[int]:
    """Try to extract semester from review content."""
    # Look for patterns like "Sem 1", "Semester 2", "S1", "S2"
    patterns = [
        r'Sem(?:ester)?\s*([12])',
        r'\bS([12])\b',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, content, re.IGNORECASE)
        if match:
            return int(match.group(1))
    
    return None


def run_ingestion(threads_file: str, posts_file: str, limit: Optional[int] = None):
    """Run the full reviews ingestion process."""
    print(f"\n{'='*60}")
    print(f"Reviews Ingestion Script")
    print(f"{'='*60}\n")
    
    # Load data
    threads = load_json_file(threads_file)
    posts = load_json_file(posts_file)
    
    # Build thread to module mapping
    thread_map = build_thread_to_module_map(threads)
    
    # Insert reviews
    success, errors = insert_reviews(posts, thread_map, limit)
    
    print(f"\n{'='*60}")
    print(f"Ingestion Complete!")
    print(f"{'='*60}")
    print(f"Reviews inserted: {success}")
    print(f"Errors: {errors}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest Disqus reviews into database")
    parser.add_argument("--threads", required=True, help="Path to threads JSON file")
    parser.add_argument("--posts", required=True, help="Path to posts JSON file")
    parser.add_argument("--limit", type=int, help="Limit number of reviews for testing")
    
    args = parser.parse_args()
    run_ingestion(threads_file=args.threads, posts_file=args.posts, limit=args.limit)
