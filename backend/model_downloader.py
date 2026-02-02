"""
Model Downloader Utility with Resumable Downloads

This module provides functionality to download Hugging Face models with:
- Chunked downloads for better reliability
- Automatic resume from interrupted downloads
- Progress tracking
- Retry logic for network failures
"""

import os
import time
from pathlib import Path
from typing import Optional
from huggingface_hub import snapshot_download
from huggingface_hub.utils import HfHubHTTPError


def download_model_with_resume(
    model_name: str,
    cache_dir: Optional[str] = None,
    max_retries: int = 5,
    retry_delay: int = 5
) -> str:
    """
    Download a Hugging Face model with resume capability.
    
    Args:
        model_name: The model identifier (e.g., "google/pegasus-xsum")
        cache_dir: Optional custom cache directory. If None, uses HF default (~/.cache/huggingface)
        max_retries: Maximum number of retry attempts on failure
        retry_delay: Initial delay between retries in seconds (uses exponential backoff)
    
    Returns:
        str: Path to the downloaded model directory
    
    Raises:
        Exception: If download fails after all retries
    """
    print(f"\n{'='*60}")
    print(f"Downloading model: {model_name}")
    print(f"{'='*60}")
    
    if cache_dir:
        cache_dir = Path(cache_dir).expanduser().resolve()
        print(f"Cache directory: {cache_dir}")
    else:
        print("Using default Hugging Face cache directory")
    
    retry_count = 0
    current_delay = retry_delay
    
    while retry_count <= max_retries:
        try:
            print(f"\nAttempt {retry_count + 1}/{max_retries + 1}")
            
            # snapshot_download automatically handles:
            # - Chunked downloads
            # - Resume from partial downloads
            # - Progress bars via tqdm
            model_path = snapshot_download(
                repo_id=model_name,
                cache_dir=cache_dir,
                resume_download=True,  # Enable resume capability
                local_files_only=False,
                # The following parameters optimize for reliability:
                max_workers=4,  # Parallel downloads for speed
                tqdm_class=None,  # Use default tqdm for progress bars
            )
            
            print(f"\n✅ Model downloaded successfully!")
            print(f"Model path: {model_path}")
            return model_path
            
        except HfHubHTTPError as e:
            print(f"\n❌ HTTP Error during download: {e}")
            retry_count += 1
            
            if retry_count > max_retries:
                print(f"\n❌ Failed to download model after {max_retries + 1} attempts")
                raise Exception(f"Failed to download {model_name} after {max_retries + 1} attempts") from e
            
            print(f"Retrying in {current_delay} seconds...")
            time.sleep(current_delay)
            current_delay *= 2  # Exponential backoff
            
        except KeyboardInterrupt:
            print("\n\n⚠️  Download interrupted by user")
            print("Progress has been saved. Run again to resume from where you left off.")
            raise
            
        except Exception as e:
            print(f"\n❌ Unexpected error during download: {e}")
            retry_count += 1
            
            if retry_count > max_retries:
                print(f"\n❌ Failed to download model after {max_retries + 1} attempts")
                raise Exception(f"Failed to download {model_name} after {max_retries + 1} attempts") from e
            
            print(f"Retrying in {current_delay} seconds...")
            time.sleep(current_delay)
            current_delay *= 2  # Exponential backoff
    
    raise Exception(f"Failed to download {model_name}")


def ensure_model_downloaded(model_name: str, cache_dir: Optional[str] = None) -> str:
    """
    Ensure a model is downloaded, downloading it if necessary.
    
    This function checks if the model is already cached. If not, it downloads it
    with resume capability.
    
    Args:
        model_name: The model identifier (e.g., "google/pegasus-xsum")
        cache_dir: Optional custom cache directory
    
    Returns:
        str: Path to the model directory
    """
    try:
        # Try to get the model from cache first (local_files_only=True)
        print(f"Checking if {model_name} is already cached...")
        model_path = snapshot_download(
            repo_id=model_name,
            cache_dir=cache_dir,
            local_files_only=True,  # Only check cache, don't download
        )
        print(f"✅ Model found in cache: {model_path}")
        return model_path
        
    except Exception:
        # Model not in cache, download it
        print(f"Model not found in cache. Downloading...")
        return download_model_with_resume(model_name, cache_dir)
