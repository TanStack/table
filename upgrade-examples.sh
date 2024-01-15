#!/bin/bash

# Change directory to the example directory
cd examples/react

# Loop through each file in the example directory
for file in *; do
  if [ -d "$file" ]; then
    echo "Processing $file..."

    # Change directory to the current file
    cd "$file"

    # Check if the sandbox file exists
    if [ -f "package.json" ]; then
      echo "  - Found package.json"
      echo "  - Running npm install in sandbox..."

      # Change directory to the sandbox directory
      cd sandbox

      ## Update dependency versions
      npx npm-check-updates -u

      # Run npm install
      # npm install --package-lock-only --force

      # echo "  - npm install completed"
      
      # Change back to the example directory
      cd ..
    else
      echo "  - No sandbox/package.json found"
    fi

    # Change back to the parent directory of the current file
    cd ..
    echo "Completed processing $file"
    echo
  fi
done

