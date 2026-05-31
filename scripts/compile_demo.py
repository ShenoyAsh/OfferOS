import os
import sys
import hashlib
import shutil
import subprocess

def get_md5(filepath):
    """Compute the MD5 hash of a file."""
    hasher = hashlib.md5()
    with open(filepath, 'rb') as f:
        buf = f.read(65536)
        while len(buf) > 0:
            hasher.update(buf)
            buf = f.read(65536)
    return hasher.hexdigest()

def main():
    source_dir = r"C:\Users\asus\.gemini\antigravity\browser_recordings\efe8c2f3-daed-4c7f-9478-571b29336045"
    temp_dir = r"C:\Users\asus\.gemini\antigravity\brain\efe8c2f3-daed-4c7f-9478-571b29336045\temp_frames"
    output_path = r"e:\Offeros\offeros\public\offeros_full_demo.mp4"

    print(f"Scanning source directory: {source_dir}")
    if not os.path.exists(source_dir):
        print(f"Error: Source directory {source_dir} does not exist!")
        sys.exit(1)

    # List and sort all jpg files by timestamp (numeric filename)
    jpg_files = []
    for f in os.listdir(source_dir):
        if f.lower().endswith('.jpg'):
            try:
                # Remove extension and parse timestamp
                ts = int(os.path.splitext(f)[0])
                jpg_files.append((ts, os.path.join(source_dir, f)))
            except ValueError:
                # Ignore non-numeric filenames
                continue

    jpg_files.sort(key=lambda x: x[0])
    total_found = len(jpg_files)
    print(f"Found {total_found} frames in source directory.")

    if total_found == 0:
        print("Error: No frames found!")
        sys.exit(1)

    # Create clean temp directory
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    os.makedirs(temp_dir)

    print("Deduplicating consecutive frames using MD5 hash...")
    selected_frames = []
    last_hash = None

    for i, (ts, filepath) in enumerate(jpg_files):
        # Print progress every 500 frames
        if i % 500 == 0:
            print(f"  Processed {i}/{total_found} frames...")
        
        try:
            curr_hash = get_md5(filepath)
            if curr_hash != last_hash:
                selected_frames.append(filepath)
                last_hash = curr_hash
        except Exception as e:
            print(f"  Error reading {filepath}: {e}")
            continue

    num_kept = len(selected_frames)
    print(f"Deduplication complete. Kept {num_kept} of {total_found} frames (dropped {total_found - num_kept} duplicates).")

    # Copy files sequentially
    print(f"Copying kept frames sequentially to {temp_dir}...")
    for idx, orig_path in enumerate(selected_frames):
        if idx % 500 == 0:
            print(f"  Copied {idx}/{num_kept} frames...")
        dest_filename = f"frame_{idx:05d}.jpg"
        shutil.copy2(orig_path, os.path.join(temp_dir, dest_filename))

    # Compile with ffmpeg
    # We choose 8 frames per second for a smooth and punchy presentation.
    fps = 8
    print(f"Compiling video at {fps} FPS to: {output_path}")
    
    # ffmpeg command with odd-dimension workaround scale filter
    ffmpeg_cmd = [
        "ffmpeg",
        "-y",                  # Overwrite output file
        "-framerate", str(fps),# Input framerate
        "-i", os.path.join(temp_dir, "frame_%05d.jpg"),
        "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",  # Fix divisible by 2 odd-width issue
        "-c:v", "libx264",     # H.264 codec
        "-pix_fmt", "yuv420p", # Broad compatibility color profile
        "-crf", "23",          # Good balance of size and quality
        output_path
    ]

    print("Running ffmpeg...")
    try:
        result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True, check=True)
        print("ffmpeg completed successfully!")
        print(f"Successfully generated high-fidelity demo video at: {output_path}")
    except subprocess.CalledProcessError as e:
        print("Error running ffmpeg:")
        print("STDOUT:", e.stdout)
        print("STDERR:", e.stderr)
        sys.exit(1)

    # Clean up temp frames to save space
    print("Cleaning up temporary frame directory...")
    shutil.rmtree(temp_dir)
    print("Done!")

if __name__ == "__main__":
    main()
