# 🚀 SUPER SIMPLE START GUIDE

## Option A: Use LAUNCHER (Recommended)

### Step 1: Open Launcher
1. Press `Windows + R` on your keyboard
2. Type: `LAUNCHER`
3. Press Enter
4. A menu will appear

### Step 2: Setup Database (First Time Only)
1. Type: `2`
2. Press Enter
3. Wait for "DATABASE READY!" message
4. Press any key

### Step 3: Start Server
1. Menu appears again
2. Type: `1`
3. Press Enter
4. Browser opens to http://localhost:5000

---

## Option B: Command Prompt Method

### Step 1: Open Command Prompt
1. Press `Windows + R`
2. Type: `cmd`
3. Press Enter

### Step 2: Run These Commands
Copy and paste each line (press Enter after each):

```
cd C:\Users\Sam\Downloads\HarvestConnect\HarvestConnect-1
npm run db:push
npm run dev
```

### Step 3: Open Browser
Once server starts, open: http://localhost:5000

---

## Troubleshooting

### Problem: "npm run dev: command not found"
**Solution:**
```
cd C:\Users\Sam\Downloads\HarvestConnect\HarvestConnect-1
npm install
npm run dev
```

### Problem: "Port 5000 in use"
**Solution:**
```
# Close the command prompt (Ctrl+C)
# Then run again:
npm run dev
```

### Problem: "Database errors"
**Solution:**
```
# Delete database if it exists
del harvest-connect.db
# Then run:
npm run db:push
npm run dev
```

### Problem: Won't work at all
**Solution:**
1. Make sure Node.js is installed
2. Download from: https://nodejs.org/
3. Install and try again

---

## How to Know It's Working

When successful, you should see:
```
Server listening on port 5000
```

And your browser opens to a website with:
- Welcome/Hero section
- Products listed
- Navigation menu at top

---

## Testing the Site

Once open, try these:
1. Click "Products" in menu
2. Try filtering by category
3. Click a product to see details
4. Try clicking "Add to Cart"

---

## Quick Reference

| Command | What it does |
|---------|---------------|
| npm run db:push | Creates database |
| npm run dev | Starts server |
| http://localhost:5000 | The website |

---

## Still Stuck?

1. Look at the error message in the black window
2. It will tell you exactly what's wrong
3. Try the solution in the Troubleshooting section above
4. If still stuck, copy the error message

---

## Files Available

You have these files to help:

| File | When to use |
|------|--------------|
| LAUNCHER.bat | Easiest - use this! |
| START-SERVER.bat | Alternative - auto everything |
| START-HERE.md | This document - read it! |

---

## Success!

When you see the website with products and navigation, you did it! 🎉

Enjoy HarvestConnect!