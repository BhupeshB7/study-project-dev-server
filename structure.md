# Study Project Server

Welcome! This is a backend server for a Study Project application built with Node.js and Express.js. This guide will help you set up and run this project on your computer, even if you're new to programming.

## 📋 What is This Project?

This is a **backend server** (the part that handles data and business logic) for a study project application. It's built using:

- **Node.js** - A platform to run JavaScript on your computer (not just in browsers)
- **Express.js** - A framework that makes building web servers easier
- **MongoDB** - A database to store all the data

## 🖥️ What You Need Before Starting

Before you can run this project, you need to install some software on your computer:

### 1. Install Node.js

Node.js is required to run this project.

**Steps:**

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (Long Term Support - the stable one)
3. Run the installer and follow the instructions
4. Click "Next" until it's installed

**Check if it's installed:**

- Open **Command Prompt** (Windows) or **Terminal** (Mac/Linux)
- Type: `node --version`
- You should see something like `v20.x.x` or similar
- Type: `npm --version`
- You should see something like `10.x.x` or similar

### 2. Install MongoDB

MongoDB is the database where all data is stored.

**Steps:**

1. Go to [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Download **MongoDB Community Server**
3. Install it with default settings
4. Make sure to select "Install MongoDB as a Service" during installation

**Check if it's installed:**

- Open Command Prompt
- Type: `mongod --version`
- You should see version information

### 3. Install Git (Optional but Recommended)

Git helps you download and manage code.

**Steps:**

1. Go to [git-scm.com](https://git-scm.com/)
2. Download and install Git
3. Use default settings during installation

**Check if it's installed:**

- Open Command Prompt
- Type: `git --version`
- You should see something like `git version 2.x.x`

### 4. Install a Code Editor (Optional but Helpful)

A code editor helps you view and edit code easily.

**Recommended: Visual Studio Code (VS Code)**

1. Go to [code.visualstudio.com](https://code.visualstudio.com/)
2. Download and install it
3. It's free and easy to use!

## 📥 How to Get This Project on Your Computer

### Method 1: Using Git (If you installed Git)

1. Open Command Prompt or Terminal
2. Navigate to where you want to save the project:

   ```
   cd Desktop
   ```

   (This goes to your Desktop. You can choose any folder you like)

3. Clone (download) the project:

   ```
   git clone <repository-url>
   ```

   (Replace `<repository-url>` with the actual URL of this project)

4. Go into the project folder:
   ```
   cd study-project-server
   ```

### Method 2: Without Git (Download Directly)

1. Go to the project page on GitHub or wherever it's hosted
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Extract (unzip) the downloaded file
5. Open Command Prompt and navigate to the extracted folder:
   ```
   cd path\to\study-project-server
   ```

## ⚙️ Setting Up the Project

### Step 1: Install Project Dependencies

Dependencies are pieces of code that this project needs to work.

1. Make sure you're inside the project folder in Command Prompt
2. Type this command:
   ```
   npm install
   ```
3. Wait for it to finish (it might take a few minutes)
4. You'll see a lot of text scrolling - that's normal!

### Step 2: Set Up Environment Variables

Environment variables are settings that the project needs.

1. You'll see a file named `.env` in the project folder
2. Open it with Notepad or VS Code
3. You need to configure these settings:

```env
NODE_ENV=development
PORT=4000
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url
MONGODB_URI=mongodb://localhost:27017/study-project
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:5173/login
```

**Important Settings:**

- `PORT=4000` - The server will run on port 4000
- `MONGODB_URI` - This connects to your local MongoDB database
- The other settings are for third-party services (ImageKit, GitHub authentication)

**For beginners:** You can start with just the MongoDB URI. The other services are optional features.

### Step 3: Make Sure MongoDB is Running

1. Open **Services** on Windows (search for "Services" in Start menu)
2. Look for **MongoDB Server**
3. Make sure its status is "Running"
4. If not, right-click and select "Start"

**OR** from Command Prompt:

```
net start MongoDB
```

## 🚀 Running the Project

Now you're ready to run the server!

1. Make sure you're in the project folder in Command Prompt
2. Type this command:
   ```
   npm start
   ```
3. You should see messages like:
   ```
   MongoDB connected successfully
   Server is running on port 5000
   ```

**Congratulations!** Your server is now running! 🎉

### Testing if it Works

1. Open your web browser (Chrome, Firefox, etc.)
2. Go to: `http://localhost:5000/health`
3. You should see:
   ```json
   {
     "success": true,
     "message": "Server is healthy"
   }
   ```

If you see this, everything is working perfectly!

## 🏗️ Project Structure Explained

Here's what each folder and file does:

```
study-project-server/
│
├── config/                  # Configuration files
│   ├── constant.js         # Store constant values used across the project
│   ├── db.js              # Database connection setup
│   ├── imagekit.js        # ImageKit (image storage) configuration
│   ├── redis.js           # Redis (caching) configuration
│   └── s3.js              # AWS S3 (file storage) configuration
│
├── const/                  # Constants and fixed values
│
├── controllers/            # Controllers - Handle requests and send responses
│   ├── email.controller.js        # Email-related operations
│   ├── notification.controller.js # Notification handling
│   └── user.controller.js         # User-related operations
│
├── middlewares/            # Middleware functions
│   └── globalErrorHandler.js  # Catches and handles errors
│
├── models/                 # Database models (structure of data)
│                          # Defines what data looks like in MongoDB
│
├── queue/                  # Queue management for background jobs
│   ├── queue.manager.js   # Manages queue operations
│   ├── queue.optimizer.js # Optimizes queue performance
│   └── queue.register.js  # Registers queue jobs
│
├── routers/                # Routes - Define API endpoints
│   ├── index.js           # Main router that combines all routes
│   └── user.router.js     # User-related routes
│
├── services/               # Services - Reusable business logic
│   ├── email.service.js   # Email service operations
│   └── user.service.js    # User service operations
│
├── utils/                  # Utility functions
│   └── logger.js          # Logging system (track what happens in the app)
│
├── validators/             # Data validation
│   └── validateBody.js    # Validate incoming data is correct
│
├── .env                    # Environment variables (secret settings)
├── .gitignore             # Tells Git which files to ignore
├── index.js               # Main entry point - Server starts here!
├── package.json           # Project information and dependencies
└── README.md              # This file - Project documentation
```

### How It Works:

1. **index.js** - The server starts here. It sets up Express and connects everything.

2. **routers/** - When someone visits a URL (like `/api/users`), routers decide what to do.

3. **controllers/** - Controllers handle the actual work (like creating a user, getting data).

4. **models/** - Define how data is structured in the database (like "a user has name, email, password").

5. **middlewares/** - Code that runs between receiving a request and sending a response (like checking if user is logged in).

6. **services/** - Reusable code for complex operations (like sending emails, processing data).

7. **utils/** - Helper functions used throughout the project.

8. **config/** - Settings for database, external services, etc.

## 🛠️ Common Commands

Here are commands you'll use often:

### Start the server:

```
npm start
```

This runs the server in development mode with auto-restart.

### Stop the server:

Press `Ctrl + C` in the Command Prompt where the server is running.

### Install a new package:

```
npm install package-name
```

### Check Node.js version:

```
node --version
```

### Check npm version:

```
npm --version
```

## ❓ Common Problems and Solutions

### Problem: "npm is not recognized"

**Solution:** Node.js is not installed properly. Reinstall Node.js and make sure to add it to PATH.

### Problem: "Cannot connect to MongoDB"

**Solution:**

- Make sure MongoDB service is running
- Check if MongoDB is installed correctly
- Verify the `MONGODB_URI` in `.env` file

### Problem: Port 5000 is already in use

**Solution:**

- Another application is using port 5000
- Change `PORT=5000` to `PORT=5001` in `.env` file
- Or stop the other application using port 5000

### Problem: "Module not found"

**Solution:**

- Run `npm install` to install all dependencies
- Make sure you're in the correct folder

## 📚 Learning Resources

If you're new to these technologies, here are some helpful resources:

### Node.js:

- [Node.js Official Docs](https://nodejs.org/en/docs/)
- [Node.js Tutorial for Beginners (YouTube)](https://www.youtube.com/results?search_query=nodejs+tutorial+for+beginners)

### Express.js:

- [Express.js Official Guide](https://expressjs.com/en/starter/installing.html)
- [Express.js Crash Course](https://www.youtube.com/results?search_query=expressjs+crash+course)

### MongoDB:

- [MongoDB University (Free Courses)](https://university.mongodb.com/)
- [MongoDB Tutorial](https://www.youtube.com/results?search_query=mongodb+tutorial)

### JavaScript:

- [JavaScript.info](https://javascript.info/)
- [freeCodeCamp JavaScript](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)

## 🤝 Need Help?

If you're stuck or have questions:

1. Read the error message carefully - it often tells you what's wrong
2. Search the error on Google - many people face similar issues
3. Check the documentation of the technology you're using
4. Ask for help from the project maintainer or team

## 🎯 What's Next?

Now that you have the server running:

1. Try exploring the code in VS Code
2. Look at the routes in `routers/` folder
3. Understand how data flows from router → controller → service → database
4. Try adding a simple new route
5. Experiment and learn!

Remember: **Everyone was a beginner once. Don't be afraid to make mistakes - that's how you learn!**

Happy coding! 🚀
