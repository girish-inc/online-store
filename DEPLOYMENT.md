# Deployment Guide

This guide provides instructions for deploying the Online Store application with the frontend on Vercel and the backend on Render.

## Prerequisites

- GitHub account
- Vercel account
- Render account
- MongoDB Atlas account (for the database)

## Frontend Deployment (Vercel)

1. **Push your code to GitHub**
   - Make sure your project is in a GitHub repository

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com) and sign in
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Select the frontend directory as the root directory
   - Vercel will automatically detect the React app

3. **Configure Environment Variables**
   - Add the following environment variable:
     - `REACT_APP_API_URL`: `https://online-store-backend.onrender.com/api`

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Once complete, you'll get a deployment URL (e.g., `https://online-store-frontend.vercel.app`)

## Backend Deployment (Render)

1. **Push your code to GitHub**
   - Make sure your project is in a GitHub repository

2. **Connect to Render**
   - Go to [Render](https://render.com) and sign in
   - Click "New" > "Web Service"
   - Connect your GitHub repository
   - Select the backend directory as the root directory

3. **Configure the Web Service**
   - Name: `online-store-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables**
   - Add the following environment variables:
     - `serverPort`: `10000`
     - `nodeEnvironment`: `production`
     - `databaseUrl`: Your MongoDB Atlas connection string
     - `jwtSecret`: Your JWT secret key
     - `jwtAccessTokenExpire`: `15m`

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - Once complete, you'll get a deployment URL (e.g., `https://online-store-backend.onrender.com`)

## Verify Deployment

1. **Test the Backend**
   - Visit your Render deployment URL (e.g., `https://online-store-backend.onrender.com`)
   - You should see the message "API is running..."

2. **Test the Frontend**
   - Visit your Vercel deployment URL (e.g., `https://online-store-frontend.vercel.app`)
   - The frontend should load and be able to communicate with the backend

## Troubleshooting

- **CORS Issues**: If you encounter CORS errors, verify that the backend CORS configuration includes your Vercel domain
- **API Connection Issues**: Check that the `REACT_APP_API_URL` is correctly set in Vercel
- **Database Connection**: Ensure your MongoDB Atlas IP whitelist includes Render's IPs or is set to allow access from anywhere
- **Environment Variables**: Double-check all environment variables are correctly set in both platforms

## Updating Your Deployment

- **Vercel**: Push changes to your GitHub repository, and Vercel will automatically rebuild and deploy
- **Render**: Push changes to your GitHub repository, and Render will automatically rebuild and deploy