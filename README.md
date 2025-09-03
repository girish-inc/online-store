# Online Store Application

A full-stack e-commerce application built with React frontend and Node.js/Express backend.

## Deployment to Vercel

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional for advanced usage)
3. MongoDB Atlas database

### Environment Variables

You'll need to set up the following environment variables in your Vercel project:

```
# Database Configuration
databaseUrl=your_mongodb_connection_string

# JWT Authentication
jwtSecret=your_jwt_secret_key
jwtAccessTokenExpire=5m
jwtRefreshTokenExpire=30d

# Cloudinary Configuration
cloudinaryCloudName=your_cloudinary_cloud_name
cloudinaryApiKey=your_cloudinary_api_key
cloudinaryApiSecret=your_cloudinary_api_secret

# Server Configuration
serverPort=5000
nodeEnvironment=production
```

### Deployment Steps

1. **Connect your GitHub repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings

2. **Configure Environment Variables**
   - Add all required environment variables in the Vercel project settings

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

## Project Structure

### Backend Structure
```
backend/
├── config/          # Configuration files
│   └── db.js       # Database connection
├── controllers/     # Route controllers
│   ├── cartController.js
│   ├── productController.js
│   └── userController.js
├── middleware/      # Custom middleware
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/          # Database models
│   ├── cartModel.js
│   ├── productModel.js
│   └── userModel.js
├── routes/          # API routes
│   ├── cartRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
├── utils/           # Utility functions
│   └── generateToken.js
├── .env            # Environment variables
├── server.js       # Main server file
└── README.md       # Backend documentation
```

### Frontend Structure
```
frontend/
├── public/          # Static files
├── src/
│   ├── assets/      # Images, fonts, etc.
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   ├── redux/       # State management
│   ├── services/    # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── index.js
│   ├── utils/       # Utility functions
│   ├── App.js       # Main app component
│   └── index.js     # Entry point
└── package.json
```

## Environment Variables

The application uses readable environment variable names for better maintainability:

### Server Configuration
- `serverPort` - Server port (default: 5000)
- `nodeEnvironment` - Node environment (development/production)

### Database Configuration
- `databaseUrl` - MongoDB connection string

### JWT Authentication
- `jwtSecret` - JWT secret key
- `jwtAccessTokenExpire` - Access token expiration time
- `jwtRefreshTokenExpire` - Refresh token expiration time

### Cloudinary Configuration (for image uploads)
- `cloudinaryCloudName` - Cloudinary cloud name
- `cloudinaryApiKey` - Cloudinary API key
- `cloudinaryApiSecret` - Cloudinary API secret

### Email Configuration (optional)
- `emailService` - Email service provider
- `emailUser` - Email username
- `emailPassword` - Email password/app password

### Frontend Configuration
- `frontendUrl` - Frontend URL for CORS

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env` in the backend folder
   - Update the variables with your actual values

5. Start the development servers:
   
   Backend:
   ```bash
   cd backend
   npm start
   ```
   
   Frontend:
   ```bash
   cd frontend
   npm start
   ```

## Features

- **Organized Project Structure**: Clean separation of concerns with dedicated folders
- **Readable Environment Variables**: Self-documenting variable names
- **Service Layer**: Centralized API calls in the frontend
- **Authentication**: JWT-based authentication system
- **Database Integration**: MongoDB with Mongoose ODM
- **Error Handling**: Comprehensive error handling middleware
- **CORS Configuration**: Proper cross-origin resource sharing setup

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.