#!/bin/bash

REACT_EXAMPLES_DIR="examples/react"
FAILED_PROJECTS=()

for project_dir in "$REACT_EXAMPLES_DIR"/*/; do
    project_name=$(basename "$project_dir")
    echo "Checking $project_name..."

    if [ -f "$project_dir/tsconfig.json" ]; then
        if ! npx tsc -p "$project_dir/tsconfig.json" --noEmit; then
            FAILED_PROJECTS+=("$project_name")
        fi
    else
        echo "⚠️  No tsconfig.json found in $project_name, skipping..."
    fi
done

echo ""
echo "============================================"
if [ ${#FAILED_PROJECTS[@]} -eq 0 ]; then
    echo "✅ All projects passed type checks!"
else
    echo "❌ Failed projects:"
    printf '%s\n' "${FAILED_PROJECTS[@]}"
    exit 1
fi
