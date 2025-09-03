# Online Store Backend

## MongoDB Atlas Connection Setup

### Step 1: Create a MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account if you don't have one already.
2. Once logged in, create a new project.

### Step 2: Create a Cluster
1. Click on "Build a Cluster" and select the free tier option (M0).
2. Choose your preferred cloud provider and region.
3. Click "Create Cluster" and wait for the cluster to be provisioned (this may take a few minutes).

### Step 3: Set Up Database Access
1. In the left sidebar, click on "Database Access" under the Security section.
2. Click "Add New Database User".
3. Create a username and password. Make sure to save these credentials securely.
4. Set appropriate privileges ("Read and Write to Any Database" is sufficient for development).
5. Click "Add User".

### Step 4: Configure Network Access
1. In the left sidebar, click on "Network Access" under the Security section.
2. Click "Add IP Address".
3. For development, you can click "Allow Access from Anywhere" (not recommended for production).
4. Click "Confirm".

### Step 5: Get Your Connection String
1. Go back to your cluster and click "Connect".
2. Select "Connect your application".
3. Copy the connection string.
4. Replace `<username>`, `<password>`, `<cluster-name>`, and `<database-name>` in the connection string with your actual values.

### Step 6: Update Your .env File
1. Open the `.env` file in the backend directory.
2. Replace the `MONGO_URI` value with your MongoDB Atlas connection string.

Example:
```
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.abcde.mongodb.net/online-store?retryWrites=true&w=majority
```

## Running the Application

1. Install dependencies:
```
npm install
```

2. Start the server:
```
npm start
```

The server will run on the port specified in your .env file (default: 5000).