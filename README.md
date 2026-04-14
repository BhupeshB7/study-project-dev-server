# How to Run study-project-server

This guide will help you set up and run the study-project-server backend on your Windows machine. It covers all dependencies, including MongoDB and Redis, and is focused on Windows users.

---

## 1. Prerequisites

### 1.1. Node.js

- Download and install Node.js (LTS version) from [nodejs.org](https://nodejs.org/).
- Verify installation:
  ```sh
  node --version
  npm --version
  ```

### 1.2. MongoDB

- Download MongoDB Community Server from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community).
- Run the installer and follow the default steps.
- **Choose the install path** (e.g., `C:\Program Files\MongoDB\Server\6.0\`).
- Make sure to select "Install MongoDB as a Service" (recommended: run service as Network Service user).

#### Add MongoDB to your PATH

- Open Start menu, search for "Environment Variables" > Edit the system environment variables > Environment Variables.
- Under "System variables", find `Path`, click Edit, and ensure a line like `C:\Program Files\MongoDB\Server\6.0\bin` is present. If not, add it:
  1. Click **New** and paste the path to your MongoDB `bin` folder.
  2. Click OK to save.
- Open a new Command Prompt and run:
  ```sh
  mongo --version
  mongod --version
  ```
  You should see version info. If not, check your PATH.

#### Start MongoDB service

- Open Services (search in Start menu), find **MongoDB Server**, and start it.
- Or run in Command Prompt:
  ```sh
  net start MongoDB
  ```

#### Set up MongoDB Replica Set (for transactions, etc.)

- Open Command Prompt and stop MongoDB if running:
  ```sh
  net stop MongoDB
  ```
- Create a folder for your MongoDB data (if not already):
  ```sh
  mkdir C:\data\db
  ```
- Start MongoDB with replica set enabled:
  ```sh
  mongod --dbpath C:\data\db --replSet rs0
  ```
- Open a new Command Prompt and connect to the shell:
  ```sh
  mongosh
  ```
- Initiate the replica set:
  ```js
  rs.initiate();
  ```
- You should see `{ "ok" : 1 }` in the output.
- Now you can use transactions and advanced MongoDB features.

#### Test MongoDB

- To connect to MongoDB shell:
  ```sh
  mongosh
  ```
- To check databases:
  ```js
  show dbs
  ```

### 1.3. Redis (via WSL)

Redis is not natively supported on Windows. Use WSL (Windows Subsystem for Linux):

#### Step 1: Install WSL

- Open PowerShell as Administrator and run:
  ```sh
  wsl --install
  ```
- Restart your computer if prompted.

#### Step 2: Set up Ubuntu

- After restart, open Ubuntu from Start menu.
- Set up your username and password for Ubuntu.

#### Step 3: Install Redis in Ubuntu (WSL)

- In the Ubuntu terminal, run:
  ```sh
  sudo apt update
  sudo apt install redis-server
  ```
- Start Redis:
  ```sh
  sudo service redis-server start
  ```
- To make Redis start automatically:
  ```sh
  sudo systemctl enable redis-server
  ```
- Test Redis:
  ```sh
  redis-cli ping
  # Should return: PONG
  ```

---

## 2. Clone the Project

- Open Command Prompt or PowerShell.
- Navigate to the folder where you want the project:
  ```sh
  cd C:\Users\YourName\Desktop
  ```
- Clone the repository:
  ```sh
  git clone <your-repo-url>
  cd study-project-server
  ```

---

## 3. Install Dependencies

- In the project folder, run:
  ```sh
  npm install
  ```

---

## 4. Configure Environment Variables

- Copy `.env.example` to `.env` (if present), or create a `.env` file in the root folder.
- Set the following variables (example):
  ```env
  NODE_ENV=development
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/study-project
  REDIS_HOST=localhost
  REDIS_PORT=6379
  COOKIE_SECRET=your_cookie_secret
  EMAIL_USER=your_email@example.com
  EMAIL_PASSWORD=your_email_password
  EMAIL_FROM=your_email@example.com
  # Add any other required variables
  ```
- Make sure the values match your local setup.

---

## 5. Start the Server

- In the project folder, run:
  ```sh
  npm run start
  ```
- You should see logs indicating MongoDB and Redis are connected, and the server is running.

---

## 6. Test the API

- Open your browser and go to:
  - [http://localhost:5000/health](http://localhost:5000/health) (health check)
  - [http://localhost:5000/docs](http://localhost:5000/docs) (API documentation)

---

## 7. Troubleshooting

- **MongoDB not running?**
  - Check Services or run `net start MongoDB`.
  - If `mongo`/`mongod` not found, check your PATH variable.
- **Replica set not working?**
  - Make sure you started `mongod` with `--replSet rs0` and ran `rs.initiate()` in the shell.
- **Redis not running?**
  - Open Ubuntu (WSL) and run `sudo service redis-server start`.
- **Port already in use?**
  - Change the `PORT` in your `.env` file.
- **Environment variables not set?**
  - Double-check your `.env` file.

---

## 8. Useful Commands

- Start server: `npm run start`
- Install dependencies: `npm install`
- Check Node version: `node --version`
- Check npm version: `npm --version`
- Check MongoDB version: `mongo --version`
- Check Redis version (in Ubuntu/WSL): `redis-server --version`

---

## 9. Need Help?

- Check the logs for errors.
- Review the README and .env setup.
- Ask your team or search online for common issues.

---

Happy coding!
