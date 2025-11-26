# CraftyNet

CraftyNet is a full-stack social media web application that allows users to connect, share posts, interact with content, and communicate in real-time. Built with modern technologies to provide a smooth, responsive, and secure user experience.

---

## 🚀 Features

### User Management
- 🔐 **Authentication**: User registration, login, and logout with JWT tokens
- 👤 **User Profiles**: Customizable profiles with avatar, bio, country, and social links
- ✏️ **Profile Editing**: Edit your profile information and settings
- 👥 **User Discovery**: Browse and search for other users

### Content Management
- 📝 **Posts**: Create, edit, and delete posts with images
- 🖼️ **Image Upload**: Support for post images and profile avatars
- 📊 **Post Status**: Draft and published post states
- 🔍 **Post Details**: View individual posts with full details

### Social Interactions
- ❤️ **Likes**: Like and unlike posts with real-time like counts
- 💬 **Comments**: Comment on posts with nested reply support
- 👫 **Following System**: Follow and unfollow other users
- 📈 **Followers/Following Lists**: View who follows you and who you follow

### Real-time Communication
- 💌 **Direct Messages**: Real-time messaging between users via WebSockets
- 📬 **Inbox**: Notification system for user interactions
- 🗨️ **Chat Rooms**: Persistent chat rooms for conversations

### User Interface
- 📱 **Responsive Design**: Mobile-friendly interface built with TailwindCSS
- 🎨 **Modern UI**: Clean and intuitive user experience
- ⚡ **Fast Performance**: Optimized with React and Vite

---

## 🛠 Tech Stack

### Frontend
- **React 19.1.1** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite 7.1.2** - Build tool and dev server
- **React Router DOM 7.8.1** - Client-side routing
- **TailwindCSS 4.1.12** - Utility-first CSS framework
- **Axios 1.11.0** - HTTP client for API requests
- **JWT Decode 4.0.0** - JWT token decoding
- **Heroicons & Lucide React** - Icon libraries
- **Flowbite 3.1.2** - UI component library
- **date-fns 4.1.0** - Date formatting utilities

### Backend
- **Django 5.2.5** - Python web framework
- **Django REST Framework** - RESTful API framework
- **Django Channels** - WebSocket support for real-time features
- **django-cors-headers** - CORS handling
- **django-rest-framework-simplejwt** - JWT authentication
- **django-countries** - Country field support
- **SQLite** - Database (development)
- **ASGI** - Asynchronous server gateway interface

### Authentication
- **JWT (JSON Web Tokens)** - Token-based authentication
- **Access Token**: 1 day lifetime
- **Refresh Token**: 30 days lifetime

---

## 📁 Project Structure

```
CraftyNet/
├── backend/                    # Django backend application
│   ├── backend/                # Main Django project settings
│   │   ├── settings.py        # Django configuration
│   │   ├── urls.py            # Main URL routing
│   │   ├── asgi.py            # ASGI configuration for WebSockets
│   │   └── middleware.py      # Custom middleware (JWT auth)
│   ├── posts/                 # Posts app
│   │   ├── models.py          # Post model
│   │   ├── views.py           # Post API views
│   │   ├── serializers.py     # Post serializers
│   │   └── urls.py            # Post URL routes
│   ├── profiles/              # User profiles app
│   │   ├── models.py          # Profile model
│   │   ├── views.py           # Profile API views
│   │   └── serializers.py     # Profile serializers
│   ├── comment/               # Comments app
│   │   ├── models.py          # Comment model (with nested replies)
│   │   └── views.py           # Comment API views
│   ├── like/                  # Likes app
│   │   ├── models.py          # Like model with signals
│   │   └── views.py           # Like API views
│   ├── following/             # Following system app
│   │   ├── models.py          # Subscription model
│   │   └── views.py           # Follow/unfollow views
│   ├── message/               # Direct messages app
│   │   ├── models.py          # Message model
│   │   ├── consumers.py       # WebSocket consumers
│   │   └── routing.py         # WebSocket routing
│   ├── chatdemo/              # Chat demo app
│   │   ├── models.py          # Chat model
│   │   └── consumers.py       # Chat WebSocket consumers
│   ├── inbox/                 # Inbox/notifications app
│   │   ├── models.py          # Inbox model
│   │   └── views.py           # Inbox API views
│   ├── media/                 # User-uploaded files
│   │   ├── posts/             # Post images
│   │   └── profiles/          # Profile avatars
│   ├── db.sqlite3             # SQLite database
│   ├── manage.py              # Django management script
│   └── env_example.env        # Environment variables template
│
└── frontend/                  # React frontend application
    ├── src/
    │   ├── App.tsx            # Main app component with routing
    │   ├── main.tsx           # React entry point
    │   ├── pages/             # Page components
    │   │   ├── Account/       # Login, Register
    │   │   ├── Menu/          # Home, NavBar
    │   │   ├── Posts/         # Post pages (Add, Edit, View)
    │   │   ├── Profiles/      # Profile pages
    │   │   ├── DirectMessages/# Messaging pages
    │   │   ├── Inbox/         # Inbox page
    │   │   └── Follow/        # Follow pages
    │   ├── components/        # Reusable components
    │   │   └── ProtectedRoute.tsx  # Route protection
    │   ├── services/          # API services
    │   │   ├── api.ts         # Axios configuration
    │   │   └── constants.ts   # Constants (tokens, etc.)
    │   └── assets/            # Static assets
    ├── package.json           # Node dependencies
    ├── vite.config.ts         # Vite configuration
    └── tsconfig.json          # TypeScript configuration
```

---

## 📦 Installation & Setup

### Prerequisites
- **Python 3.12+** (with virtual environment support)
- **Node.js 18+** and npm
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/CraftyNet.git
cd CraftyNet
```

### 2. Backend Setup

#### Create and Activate Virtual Environment
```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

#### Install Dependencies
```bash
pip install django==5.2.5
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
pip install channels
pip install django-countries
pip install Pillow
```

Or create a `requirements.txt` and install:
```bash
pip install -r requirements.txt
```

#### Environment Configuration
```bash
# Copy the example environment file
cp env_example.env .env

# Edit .env and add your SECRET_KEY
# SECRET_KEY=YourSecretKeyHere
```

#### Database Setup
```bash
python manage.py migrate
```

#### Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

#### Run Development Server
```bash
python manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../frontend
```

#### Install Dependencies
```bash
npm install
```

#### Run Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## ⚙️ Configuration

### Backend Configuration

#### CORS Settings
The backend is configured to allow all origins in development. For production, update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` in `backend/settings.py`.

#### Media Files
Media files (images) are stored in `backend/media/`. Make sure the directory exists and has proper permissions.

#### WebSocket Configuration
WebSockets are configured using Django Channels with InMemoryChannelLayer for development. For production, use Redis or another channel layer.

### Frontend Configuration

#### API Base URL
The API base URL is configured in `frontend/src/services/api.ts`. Default is `http://127.0.0.1:8000`. Update if your backend runs on a different port.

---

## 🔌 API Endpoints

### Authentication
- `POST /api/register/` - Register a new user
- `POST /api/login/` - Login user
- `POST /api/token/` - Obtain JWT token pair
- `POST /api/token/refresh/` - Refresh access token
- `POST /api/token/verify/` - Verify token

### Profiles
- `GET /api/profiles/` - Get all user profiles
- `GET /api/profiles/my/` - Get current user's profile
- `GET /api/profiles/<username>/` - Get specific user profile

### Posts
- `GET /api/posts/` - List all posts
- `POST /api/posts/add/` - Create a new post
- `GET /api/posts/<id>/` - Get post details
- `PUT /api/posts/<id>/update/` - Update a post
- `DELETE /api/posts/<id>/delete/` - Delete a post
- `GET /api/posts/author/<id>/` - Get posts by author

### Comments
- `GET /api/posts/<post_id>/comments/` - Get comments for a post
- `POST /api/posts/<post_id>/comments/` - Add a comment

### Likes
- `GET /api/post/<post_id>/likes/` - Get likes for a post
- `POST /api/user/<username>/post/<post_id>/likes/` - Like/unlike a post

### Following
- `POST /api/users/follow/<username>/` - Follow a user
- `POST /api/users/unfollow/<username>/` - Unfollow a user
- `GET /api/users/followings/<username>/` - Get following list
- `GET /api/users/followers/<username>/` - Get followers list

### Messages & Chat
- WebSocket: `ws://127.0.0.1:8000/ws/chat/<sender_id>_<receiver_id>/` - Real-time chat

### Inbox
- `GET /api/inbox/` - Get inbox messages
- `POST /api/inbox/` - Create inbox notification

---

## 📖 Usage Guide

### Getting Started

1. **Register an Account**
   - Navigate to `/register`
   - Fill in your details (username, email, password)
   - Submit the form

2. **Login**
   - Go to `/login`
   - Enter your credentials
   - You'll be redirected to the home page

3. **Create a Post**
   - Click "Add Post" or navigate to `/addSyrym/`
   - Add a title, content, and optionally an image
   - Publish your post

4. **Interact with Posts**
   - Like posts by clicking the like button
   - Comment on posts by typing in the comment section
   - Reply to comments (nested comments supported)

5. **Follow Users**
   - Browse users at `/users`
   - Visit a user profile at `/users/<username>`
   - Click "Follow" to follow them

6. **Send Messages**
   - Navigate to `/messages`
   - Select a user to start a conversation
   - Send real-time messages via WebSocket

7. **Edit Your Profile**
   - Go to `/my` to view your profile
   - Click "Edit Profile" to update your information
   - Add an avatar, bio, country, and social links

---

## 🗄️ Database Models

### User (Django Built-in)
- Standard Django User model with authentication

### Profile
- `user` - OneToOne relationship with User
- `avatar` - Profile picture
- `bio` - User biography
- `country` - User's country
- `social_link` - Social media link

### Posts
- `title` - Post title
- `post` - Post content
- `about` - Post description
- `photo` - Post image
- `author` - ForeignKey to User
- `profile` - ForeignKey to Profile
- `likes_count` - Number of likes
- `is_published` - Publication status
- `time` - Creation timestamp
- `time_update` - Last update timestamp
- `slug` - URL-friendly identifier

### Comment
- `sender` - ForeignKey to User
- `resiever` - ForeignKey to Posts
- `parent` - Self-referential for nested replies
- `content` - Comment text
- `created_at` - Timestamp

### Like
- `post` - ForeignKey to Posts
- `user` - ForeignKey to User
- Automatically updates post `likes_count` via signals

### Subscription (Following)
- `follower` - User who follows
- `to_user` - User being followed
- Unique constraint on (follower, to_user)

### Message
- `room` - Chat room identifier
- `sender` - ForeignKey to User
- `recipient` - ForeignKey to User
- `content` - Message text
- `timestamp` - Message timestamp

### Inbox
- `sender` - ForeignKey to User
- `resiever` - ForeignKey to User
- `link` - Related link
- `context` - Notification context
- `readed` - Read status
- `timestamp` - Notification timestamp

### Chat
- `room` - Chat room identifier
- `sender` - ForeignKey to User
- `receiver` - ForeignKey to User
- `content` - Chat message
- `timestamp` - Message timestamp

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Validation**: Django's built-in password validators
- **CORS Protection**: Configured CORS headers
- **CSRF Protection**: Django CSRF middleware
- **Protected Routes**: Frontend route protection for authenticated users
- **Media File Security**: Proper file upload handling

---

## 🧪 Development

### Running Tests
```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm run test  # If tests are configured
```

### Building for Production

#### Frontend
```bash
cd frontend
npm run build
```
The build output will be in `frontend/dist/`

#### Backend
For production deployment:
1. Set `DEBUG = False` in `settings.py`
2. Configure proper `ALLOWED_HOSTS`
3. Set up a production database (PostgreSQL recommended)
4. Configure proper channel layer (Redis)
5. Use a production ASGI server (Daphne, Uvicorn)

---

## 🐛 Troubleshooting

### Backend Issues

**Database Migration Errors**
```bash
python manage.py makemigrations
python manage.py migrate
```

**Media Files Not Loading**
- Ensure `MEDIA_ROOT` and `MEDIA_URL` are correctly configured
- Check file permissions on the `media/` directory

**CORS Errors**
- Verify `CORS_ALLOW_ALL_ORIGINS = True` in development
- Check `ALLOWED_HOSTS` includes your frontend URL

### Frontend Issues

**API Connection Errors**
- Verify backend is running on `http://127.0.0.1:8000`
- Check `baseURL` in `frontend/src/services/api.ts`
- Ensure CORS is properly configured

**Token Issues**
- Clear localStorage and re-login
- Check token expiration settings

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

## 🙏 Acknowledgments

- Django REST Framework for the robust API framework
- React team for the excellent UI library
- TailwindCSS for the utility-first CSS framework
- All contributors and users of CraftyNet

---

**Happy Coding! 🚀**
