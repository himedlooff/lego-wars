#!/bin/bash

# Image compression and metadata removal script for lego-wars project
# Usage: ./compress-images.sh [source_dir] [target_dir] [quality] [max_size]

# Set default values
SOURCE_DIR="${1:-originals}"
TARGET_DIR="${2:-assets}"
QUALITY="${3:-70}"
MAX_SIZE="${4:-1920}"

# Get script directory to make paths relative to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🖼️  Image Compression & Metadata Removal Script"
echo "================================================"

# Check if source directory exists
if [[ ! -d "$SOURCE_DIR" ]]; then
    echo "❌ Error: Source directory '$SOURCE_DIR' does not exist"
    exit 1
fi

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Check if there are any jpg files in source
if ! ls "$SOURCE_DIR"/*.jpg >/dev/null 2>&1; then
    echo "❌ No .jpg files found in '$SOURCE_DIR'"
    exit 1
fi

echo "📁 Source: $SOURCE_DIR"
echo "📁 Target: $TARGET_DIR"
echo "🎛️  Quality: ${QUALITY}%"
echo "📏 Max size: ${MAX_SIZE}px"
echo ""

# Count total files for progress
TOTAL_FILES=$(ls "$SOURCE_DIR"/*.jpg 2>/dev/null | wc -l | tr -d ' ')
CURRENT_FILE=0

echo "🔄 Compressing $TOTAL_FILES images..."

# Compress and move images
for file in "$SOURCE_DIR"/*.jpg; do
    CURRENT_FILE=$((CURRENT_FILE + 1))
    FILENAME=$(basename "$file")
    echo "   Processing ($CURRENT_FILE/$TOTAL_FILES): $FILENAME"
    
    # Compress with sips
    sips --resampleHeightWidthMax "$MAX_SIZE" --setProperty formatOptions "$QUALITY" "$file" --out "$TARGET_DIR/$FILENAME" > /dev/null 2>&1
    
    if [[ $? -eq 0 ]]; then
        echo "   ✅ Compressed: $FILENAME"
    else
        echo "   ❌ Failed: $FILENAME"
    fi
done

echo ""
echo "🧹 Removing metadata from compressed images..."

# Check if exiftool is available
if ! command -v exiftool &> /dev/null; then
    echo "❌ exiftool not found. Install with: brew install exiftool"
    exit 1
fi

# Remove all metadata using exiftool
CLEANED_COUNT=$(exiftool -all= -overwrite_original "$TARGET_DIR"/*.jpg 2>/dev/null | grep -c "image files updated" || echo "0")

echo ""
echo "🎉 Complete!"
echo "📊 Processed: $TOTAL_FILES images"
echo "📁 Saved to: $TARGET_DIR"
echo "🧹 Metadata removed from all images"
echo ""
echo "Usage examples:"
echo "  ./compress-images.sh                     # Use defaults"
echo "  ./compress-images.sh originals assets 80  # Higher quality"
echo "  ./compress-images.sh originals assets 60 1080  # Smaller size"
