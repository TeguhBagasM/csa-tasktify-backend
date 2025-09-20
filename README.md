# Express.js API with Sequelize and PostgreSQL

A complete RESTful API built with Express.js, Sequelize ORM, and PostgreSQL. This project includes user management, categories, tasks, and subtasks with proper relationships and CRUD operations.

## 📋 Features

- **User Management**: Create, read, update, delete users
- **Category Management**: Organize tasks by categories (linked to users)
- **Task Management**: Create and manage tasks within categories
- **Subtask Management**: Break down tasks into smaller subtasks
- **Database Relationships**: Proper foreign key relationships between entities
- **Validation**: Input validation using Sequelize validators
- **Error Handling**: Comprehensive error handling and responses
- **Modular Structure**: Clean separation of routes, controllers, and models
- **Ready for Deployment**: Configured for Vercel deployment

## 🚀 Database Schema

### Tables and Relationships

```
users (1) → (M) categories (1) → (M) tasks (1) → (M) subtasks
```

#### Users Table

- `id` (Primary Key, Auto Increment)
- `name` (String, Required)
- `email` (String, Unique, Required)
- `password` (String, Required)
- `created_at`, `updated_at`

#### Categories Table

- `id` (Primary Key, Auto Increment)
- `user_id` (Foreign Key → users.id)
- `name` (String, Required)
- `created_at`, `updated_at`

#### Tasks Table

- `id` (Primary Key, Auto Increment)
- `category_id` (Foreign Key → categories.id)
- `title` (String, Required)
- `description` (Text, Optional)
- `created_at`, `updated_at`

#### Subtasks Table

- `id` (Primary Key, Auto Increment)
- `task_id` (Foreign Key → tasks.id)
- `title` (String, Required)
- `description` (Text, Optional)
- `is_done` (Boolean, Default: false)
- `created_at`, `updated_at`

## 📁 Project Structure

```
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── userController.js    # User CRUD operations
│   ├── categoryController.js # Category CRUD operations
│   ├── taskController.js    # Task CRUD operations
│   └── subtaskController.js # Subtask CRUD operations
├── models/
│   ├── index.js            # Database connection and associations
│   ├── User.js             # User model
│   ├── Category.js         # Category model
│   ├── Task.js             # Task model
│   └── Subtask.js          # Subtask model
├── routes/
│   ├── userRoutes.js       # User routes
│   ├── categoryRoutes.js   # Category routes
│   ├── taskRoutes.js       # Task routes
│   └── subtaskRoutes.js    # Subtask routes
├── .env.example            # Environment variables example
├── server.js               # Main application file
├── package.json            # Dependencies and scripts
├── vercel.json             # Vercel deployment configuration
└── README.md               # This file
```

## 🛠️ Local Development Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd express-sequelize-postgresql-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your database credentials:

   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASS=your_password_here
   DB_NAME=your_database_name
   DB_PORT=5432
   NODE_ENV=development
   PORT=3000
   ```

4. **Create PostgreSQL database**

   ```sql
   CREATE DATABASE your_database_name;
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Test the API**
   - Health check: `http://localhost:3000/api/health`
   - API documentation: `http://localhost:3000`

## 📡 API Endpoints

### Health Check

- `GET /api/health` - API status check

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/user/:userId` - Get categories by user ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `GET /api/tasks/category/:categoryId` - Get tasks by category ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Subtasks

- `GET /api/subtasks` - Get all subtasks
- `GET /api/subtasks/:id` - Get subtask by ID
- `GET /api/subtasks/task/:taskId` - Get subtasks by task ID
- `POST /api/subtasks` - Create new subtask
- `PUT /api/subtasks/:id` - Update subtask
- `PATCH /api/subtasks/:id/toggle` - Toggle subtask completion
- `DELETE /api/subtasks/:id` - Delete subtask

## 📦 Example API Usage

### Create a User

```bash
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create a Category

```bash
POST /api/categories
Content-Type: application/json

{
  "user_id": 1,
  "name": "Work Projects"
}
```

### Create a Task

```bash
POST /api/tasks
Content-Type: application/json

{
  "category_id": 1,
  "title": "Complete API Documentation",
  "description": "Write comprehensive API documentation"
}
```

### Create a Subtask

```bash
POST /api/subtasks
Content-Type: application/json

{
  "task_id": 1,
  "title": "Write endpoint descriptions",
  "description": "Document all API endpoints with examples",
  "is_done": false
}
```

## 🚀 Vercel Deployment

### Prerequisites for Deployment

1. **Vercel account** - Sign up at [vercel.com](https://vercel.com)
2. **PostgreSQL database** - Use services like:
   - [Neon](https://neon.tech) (Recommended - Free tier available)
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)
   - [PlanetScale](https://planetscale.com)

### Deployment Steps

1. **Set up PostgreSQL database**

   - Create a database on your chosen provider
   - Get the connection string (DATABASE_URL)

2. **Deploy to Vercel**

   **Option A: Using Vercel CLI**

   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

   **Option B: Using Vercel Dashboard**

   - Connect your GitHub repository to Vercel
   - Import the project
   - Configure environment variables

3. **Configure Environment Variables in Vercel**

   In Vercel dashboard, go to Project Settings → Environment Variables:

   ```
   DATABASE_URL=postgresql://username:password@hostname:port/database_name
   NODE_ENV=production
   ```

4. **Deploy**
   - Push code to your repository (if using GitHub integration)
   - Or run `vercel --prod` (if using CLI)

### Important Notes for Production

- The app automatically detects production environment and uses `DATABASE_URL`
- SSL is enabled for production database connections
- Database tables are created automatically on first run
- Health check endpoint: `https://your-app.vercel.app/api/health`

## 🧪 Testing the Deployed API

Once deployed, test your API:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Create a user
curl -X POST https://your-app.vercel.app/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 🛠️ Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations (if using Sequelize CLI)
- `npm run db:seed` - Run database seeders (if using Sequelize CLI)

## 🔧 Environment Variables

### Local Development

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASS=your_password
DB_NAME=your_database
DB_PORT=5432
NODE_ENV=development
PORT=3000
```

### Production (Vercel)

```env
DATABASE_URL=postgresql://username:password@hostname:port/database_name
NODE_ENV=production
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or issues, please open an issue in the GitHub repository.

---

**Happy coding! 🚀**
