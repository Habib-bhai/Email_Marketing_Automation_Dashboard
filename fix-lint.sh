#!/bin/bash

# Script to auto-fix common ESLint issues

echo "🔧 Auto-fixing ESLint issues..."

cd "$(dirname "$0")"

# Run ESLint with --fix flag
npx eslint . --ext .ts,.tsx --fix --max-warnings=0 2>&1 || true

# Fix specific patterns that ESLint might miss

# Remove unused NextResponse imports
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" -not -path "*/.next/*" | while read file; do
    if grep -q "import.*NextResponse.*from 'next/server'" "$file" && ! grep -q "NextResponse\." "$file" && ! grep -q "return NextResponse" "$file"; then
        echo "Fixing NextResponse import in: $file"
        sed -i 's/import { NextRequest, NextResponse }/import { NextRequest }/g' "$file"
        sed -i 's/import { NextResponse, NextRequest }/import { NextRequest }/g' "$file"
    fi
done

# Replace any: with unknown for catch blocks
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" -not -path "*/.next/*" | while read file; do
    sed -i 's/catch (error: any)/catch (error)/g' "$file"
    sed -i 's/catch (err: any)/catch (err)/g' "$file"
done

echo "✅ Auto-fix complete. Running lint check..."

# Run lint again to see remaining issues
npm run lint

