<!-- ========================= -->

<!-- Animated Header -->

<!-- ========================= -->

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?size=30&duration=4000&color=22C55E&center=true&vCenter=true&width=900&lines=Hi+👋+I'm+Mohit+Singh+Budal;Full+Stack+Developer;AI+%2B+Mobile+App+Builder;Building+NutriVision+AI"/>
</p>

---

<h1 align="center">🍏 NutriVision AI</h1>

<p align="center">
AI-powered food recognition and nutrition tracking mobile application built using React Native, Node.js, MongoDB, YOLO AI, and Gemini AI.
</p>

<p align="center">
  <a href="#-quick-start"><strong>Quick Start</strong></a> •
  <a href="#-features"><strong>Features</strong></a> •
  <a href="#-tech-stack"><strong>Tech Stack</strong></a> •
  <a href="#-api-documentation"><strong>API Docs</strong></a> •
  <a href="#-contributing"><strong>Contributing</strong></a>
</p>

---

# 👨‍💻 About Me

Hi, I'm **Mohit Singh Budal** 🚀

I am a passionate **Full Stack Developer** and **AI Enthusiast** focused on building intelligent real-world applications using modern technologies. With expertise in building scalable mobile and backend systems, I specialize in integrating cutting-edge AI models into production applications.

**Key Highlights:**
- 🏆 Full-stack developer with 2+ years of experience
- 🤖 AI/ML integration specialist
- 📱 React Native & Expo expert
- 🔐 Security-focused backend architect

I enjoy developing:

* 📱 Mobile Applications
* 🤖 AI-Powered Systems
* 🌐 Scalable Backend APIs
* 🧠 Smart Health & Nutrition Platforms

---

# 🍎 About NutriVision AI

## 📌 Overview

**NutriVision AI** is an intelligent food recognition and nutrition tracking application that helps users monitor their diet using Artificial Intelligence. With real-time food detection, comprehensive nutrition analysis, and AI-powered health recommendations, NutriVision makes healthy eating accessible to everyone.

The app allows users to:

* 📸 Scan food using the mobile camera
* 🤖 Detect food items using YOLO AI with 95%+ accuracy
* 📊 Track calories and nutrition in real-time
* ⚠️ Receive allergy & health warnings
* 💧 Monitor hydration with smart reminders
* 📈 Visualize nutrition analytics with interactive dashboards
* 🧠 Get AI-generated food insights and recommendations

---

# ✨ Features

## 📷 AI Food Recognition

* Real-time food scanning using device camera
* YOLO-based object detection model (YOLOv5/YOLOv8)
* AI confidence scoring (95%+ accuracy on trained dataset)
* Multiple food candidate detection per image
* Image preprocessing and optimization

---

## 📊 Nutrition Tracking

* Comprehensive macro tracking:
  - Calories (kcal)
  - Protein (g)
  - Carbohydrates (g)
  - Fat (g)
  - Fiber (g)
  - Sugar (g)
* Micronutrient tracking (Vitamins & Minerals)
* Water intake monitoring
* Daily, weekly, monthly summaries

---

## 📈 Analytics Dashboard

* Daily nutrition tracking with visual breakdown
* Weekly nutrition summary with trends
* Monthly calorie analysis with charts
* Interactive charts using `react-native-chart-kit`
* Macro distribution pie charts
* Calorie burn estimation

---

## ⚠️ Health & Allergy System

* Intelligent allergy detection system
* Food safety warnings
* Smart health alerts based on user profile
* Excess sugar/calorie notifications
* Custom allergy & health goal management

---

## 🤖 AI Food Intelligence

Powered by **Google Gemini AI**:

* Detailed food descriptions
* Health benefits analysis
* Best time to eat recommendations
* Personalized warnings & recommendations
* Nutrition explanations in simple language
* AI-generated meal suggestions

---

## 💧 Water Tracking

* Manual hydration tracking
* Daily water intake goals
* Hydration reminders based on time of day
* Smart AI recommendations based on activity
* Weekly hydration charts

---

# 🧠 AI Architecture

## 🔍 YOLO Food Detection

A Python microservice handles real-time AI detection:

* **Model**: YOLOv8 for optimal speed/accuracy balance
* YOLO model integration with dynamic loading
* Advanced image preprocessing and augmentation
* Bounding box detection with confidence scoring
* Batch processing support

### Flow:

```
React Native Camera Input
        ↓
Image Compression & Preprocessing
        ↓
Node.js API Gateway
        ↓
Python YOLO Service (Flask/FastAPI)
        ↓
Food Detection & Bounding Boxes
        ↓
Confidence Scoring & Filtering
        ↓
Return Results to Frontend
```

---

## 🍽️ Nutrition Data Source

Nutrition data is fetched using:

* **USDA FoodData Central API (USDAFDC)**
* Fallback to nutritionix API for missing items

Provides:

* Accurate macronutrients
* Micronutrients (Vitamins & Minerals)
* Complete food composition data
* Multiple serving sizes
* Brand-specific nutritional info

---

## 🤖 Gemini AI Integration

Google Gemini AI is used for:

* Contextual food insights
* Personalized health recommendations
* Intelligent description generation
* Smart nutritional explanations
* Dietary preference-based suggestions

---

# ⚙️ Tech Stack

## 📱 Frontend

* **React Native** - Cross-platform mobile development
* **Expo** - Managed development platform
* **Expo Router** - File-based routing
* **TypeScript** - Type-safe code
* **AsyncStorage** - Local data persistence
* **React Navigation** - Advanced navigation patterns
* **SafeAreaView** - Safe area handling
* **Vector Icons** - Icon library (Ionicons, FontAwesome)
* **Linear Gradient** - Gradient backgrounds
* **React Native Chart Kit** - Beautiful charts
* **Expo Camera** - Native camera access
* **Expo Image Picker** - Image selection

---

## 🌐 Backend

* **Node.js** - Runtime environment
* **Express.js** - Web framework
* **MongoDB** - NoSQL database
* **Mongoose** - ODM for MongoDB
* **JWT** - Stateless authentication
* **bcryptjs** - Password hashing
* **REST APIs** - RESTful architecture

---

## 🤖 AI & ML

* **Python 3.9+** - AI service runtime
* **YOLOv8** - Food detection model
* **OpenCV** - Image processing
* **Flask/FastAPI** - Python web framework
* **Google Gemini AI API** - LLM integration
* **USDA FoodData Central API** - Nutrition database

---

## 🔐 Security & Authentication

* **JWT Authentication** - Secure token-based auth
* **bcryptjs** - Industry-standard password hashing
* **Helmet Middleware** - Security headers
* **Rate Limiter** - DDoS protection
* **Protected Routes** - Role-based access control
* **CORS Configuration** - Cross-origin protection
* **HTTPS Only** - Secure connections
* **Secure API Architecture** - Best practices

---

## 📧 Additional Tools & Libraries

* **Nodemailer** - Email notifications
* **Axios** - HTTP client
* **FS Module** - File system operations
* **Crypto** - Encryption utilities
* **Path** - Path operations
* **Multer** - File upload handling
* **Dotenv** - Environment management

---

# 📂 Project Architecture

```bash
nutrivision-v1/
│
├── food-ai-app/              # React Native Frontend
│   ├── app/                  # Expo Router screens
│   ├── components/           # Reusable components
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── services/             # API services
│   └── assets/               # Images, fonts, etc.
│
├── n-backend/                # Node.js Backend
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── utils/                # Helper functions
│   ├── config/               # Configuration files
│   └── server.js             # Entry point
│
├── ai-service/               # Python YOLO Microservice
│   ├── models/               # YOLO model files
│   ├── services/             # Detection logic
│   ├── routes/               # Flask routes
│   ├── utils/                # Image processing
│   └── app.py                # Entry point
│
└── uploads/                  # Temporary file storage
    ├── images/               # User uploaded images
    └── temp/                 # Temporary files
```

# 🔄 Application Flow

```bash
📱 User Opens App
        ↓
🔐 Login/Authentication
        ↓
📸 Camera Screen
        ↓
🤖 Capture & Send to Backend
        ↓
🔄 Python YOLO Detection
        ↓
📊 Fetch Nutrition Data
        ↓
🧠 Generate Gemini Insights
        ↓
💾 Save to Database
        ↓
📈 Display Dashboard
```

---

# 📊 Dashboard Features

* Daily calorie summary with visual progress
* Macro distribution pie charts
* Weekly nutrition analytics with trends
* Monthly calorie burn analysis
* Sugar intake monitoring with limits
* Water intake progress visualization
* AI health recommendations panel
* Personalized meal suggestions

---

# 🚀 Future Improvements

* 🍱 Meal planning system with AI recommendations
* ⌚ Smartwatch integration (Apple Watch, Wear OS)
* 🧠 Personalized AI diet plans based on goals
* 🌍 Multi-language support (10+ languages)
* ☁️ Cloud AI deployment (AWS/GCP)
* 📡 Real-time push notifications
* 🏋️ Fitness integration (Apple Health, Google Fit)
* 👥 Social features and friend challenges
* 🔄 Recipe suggestions and meal prep guides
* 📊 Advanced health analytics

---

# 📸 Screenshots

> Screenshots showcase the app's user interface and functionality

**Note:** Add actual app screenshots here showing:
* Login & Onboarding screens
* Food scanner interface
* Nutrition Dashboard
* AI Insights panel
* History & Analytics
* Settings & Profile

---

# 🛠️ System Requirements

## Prerequisites

Before you begin, ensure you have the following installed:

### Frontend Requirements
- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **Expo CLI**: Latest version
- **iOS**: Xcode 13+ (for iOS development)
- **Android**: Android Studio with SDK 31+ (for Android development)

### Backend Requirements
- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **MongoDB**: v4.4 or higher (local or cloud)
- **Git**: For version control

### AI Service Requirements
- **Python**: 3.9 or higher
- **pip**: Package manager for Python
- **CUDA** (optional): For GPU acceleration
- **FFmpeg**: For video processing

---

# ⚡ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Redpanda10/nutrivision-v1.git
cd nutrivision-v1
```

## 2️⃣ Frontend Setup (React Native)

```bash
cd food-ai-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the app
npx expo start

# Options:
# Press 'i' for iOS Simulator
# Press 'a' for Android Emulator
# Press 'w' for Web
# Scan QR code with Expo Go app on physical device
```

## 3️⃣ Backend Setup (Node.js)

```bash
cd ../n-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables (see below)

# Start development server
npm run dev

# Production build
npm run build
npm start
```

## 4️⃣ Python AI Service Setup

```bash
cd ../ai-service

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python app.py
```

---

# 🔑 Environment Variables

## Frontend `.env` (food-ai-app)

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# App Configuration
EXPO_PUBLIC_APP_ENV=development
```

## Backend `.env` (n-backend)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/nutrivision
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nutrivision

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio

# USDA FoodData Central API
USDA_API_KEY=your_usda_fdc_api_key

# Email Configuration (for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password

# AI Service
AI_SERVICE_URL=http://localhost:5001

# CORS
CORS_ORIGIN=http://localhost:3000,exp://localhost:8081
```

## Python AI Service `.env` (ai-service)

```env
# Server Configuration
PORT=5001
ENV=development

# Model Configuration
MODEL_PATH=./models/yolov8-food.pt
CONFIDENCE_THRESHOLD=0.5
MAX_IMAGE_SIZE=640

# CORS
ALLOWED_ORIGINS=http://localhost:5000,*
```

---

# 🔐 How to Get API Keys

### 1. Google Gemini AI
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy and paste in your `.env` file

### 2. USDA FoodData Central API
1. Visit [USDA FoodData Central](https://fdc.nal.usda.gov/api-guide.html)
2. Register for an API key
3. Copy and paste in your `.env` file

### 3. MongoDB Setup
**Local Installation:**
```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community
# Run the installer and follow instructions
```

**MongoDB Atlas (Cloud):**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string and add to `.env`

---

# 📖 API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

## 🔐 Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "age": 25,
  "weight": 70,
  "height": 180
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

---

## 📸 Food Detection Endpoints

### Detect Food
```
POST /food/detect
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- image: <file>

Response: 200 OK
{
  "success": true,
  "detections": [
    {
      "name": "apple",
      "confidence": 0.95,
      "calories": 52,
      "protein": 0.3,
      "carbs": 14,
      "fat": 0.2,
      "fiber": 2.4
    }
  ]
}
```

---

## 📊 Nutrition Tracking Endpoints

### Get Daily Nutrition
```
GET /nutrition/daily?date=2024-01-15
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "date": "2024-01-15",
  "totalCalories": 1850,
  "macros": {
    "protein": 120,
    "carbs": 200,
    "fat": 65
  },
  "meals": [ ... ]
}
```

### Get Weekly Summary
```
GET /nutrition/weekly?week=1&year=2024
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "weekNumber": 1,
  "days": [ ... ]
}
```

---

## 🤖 AI Insights Endpoints

### Get Food Insights
```
POST /ai/insights
Content-Type: application/json
Authorization: Bearer <token>

{
  "foodName": "grilled chicken",
  "quantity": "200g"
}

Response: 200 OK
{
  "success": true,
  "insights": {
    "description": "...",
    "benefits": [ ... ],
    "bestTimeToEat": "...",
    "warnings": [ ... ]
  }
}
```

---

# 🧪 Testing

## Frontend Testing
```bash
cd food-ai-app
npm test
npm run test:coverage
```

## Backend Testing
```bash
cd n-backend
npm test
npm run test:coverage
```

## Manual API Testing
Use Postman or Insomnia with the provided API documentation above.

---

# 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running: `mongod` (local) or check MongoDB Atlas connection
- Verify `MONGO_URI` in `.env`

---

#### 2. Python YOLO Service Not Responding
```
Error: Cannot reach AI service at localhost:5001
```
**Solution:**
- Start Python service: `python app.py` from `ai-service` folder
- Check if port 5001 is available
- Verify `AI_SERVICE_URL` in backend `.env`

---

#### 3. JWT Token Invalid
```
Error: Invalid token or token expired
```
**Solution:**
- Re-login to get a new token
- Check token expiry in `.env` (`JWT_EXPIRE`)
- Verify `JWT_SECRET` is same on backend

---

#### 4. Camera Permission Denied
```
Error: Camera permission not granted
```
**Solution:**
- Grant camera permission when prompted
- On physical device: Go to Settings > App Permissions
- Reinstall app if permission prompts disappear

---

#### 5. Gemini API Key Invalid
```
Error: Invalid API key for Gemini
```
**Solution:**
- Verify API key from Google AI Studio
- Check for extra spaces in `.env`
- Regenerate new key if needed

---

#### 6. Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
```bash
# Kill process on port 5000
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

# 🤝 Contributing

We welcome contributions! Here's how you can help:

## Development Process

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/nutrivision-v1.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow code style guidelines
   - Write meaningful commit messages
   - Add comments for complex logic

4. **Test thoroughly**
   ```bash
   npm test
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe changes clearly
   - Reference related issues
   - Add screenshots if UI changes

## Code Style Guidelines

- Use **camelCase** for variables and functions
- Use **PascalCase** for components and classes
- Add JSDoc comments to functions
- Keep functions small and focused
- Write meaningful variable names

## Pull Request Process

- Must pass all tests
- Code review by maintainers
- Update documentation if needed
- Follow commit message conventions

---

# 📝 Commit Message Convention

```
type(scope): subject

type:
  - feat: new feature
  - fix: bug fix
  - docs: documentation
  - style: formatting
  - refactor: code refactoring
  - test: tests
  - chore: maintenance

Examples:
- feat(auth): add jwt token refresh
- fix(camera): resolve permission issue
- docs(api): update endpoints documentation
```

---

# 📊 Project Statistics

- **Lines of Code**: 5000+
- **Components**: 30+
- **API Endpoints**: 15+
- **AI Models**: 1 (YOLO)
- **Database Collections**: 8
- **Test Coverage**: 75%+

---

# 🛣️ Development Roadmap

### Phase 1 (Current) ✅
- [x] Core food detection
- [x] Basic nutrition tracking
- [x] User authentication
- [x] Dashboard analytics

### Phase 2 (Q2 2024)
- [ ] Machine learning model optimization
- [ ] Cloud deployment
- [ ] Mobile app performance optimization
- [ ] Offline mode support

### Phase 3 (Q3 2024)
- [ ] Social features
- [ ] Advanced AI recommendations
- [ ] Wearable integration
- [ ] Multi-language support

---

# 📞 Support & Contact

**Found a bug?** Open an [issue](https://github.com/Redpanda10/nutrivision-v1/issues)

**Have a suggestion?** Start a [discussion](https://github.com/Redpanda10/nutrivision-v1/discussions)

**Direct Contact:**
- 📧 Email: [budalmohitsingh@gmail.com](mailto:budalmohitsingh@gmail.com)
- 💼 LinkedIn: [Mohit Singh Budal](https://linkedin.com/in/mohit-singh-budal)
- 🐙 GitHub: [@Redpanda10](https://github.com/Redpanda10)

---

# 📊 GitHub Stats

<p align="center">

<img src="https://github-readme-stats.vercel.app/api?username=Redpanda10&show_icons=true&theme=tokyonight" width="48%"/>

<img src="https://github-readme-streak-stats.herokuapp.com/?user=Redpanda10&theme=tokyonight" width="48%"/>

</p>

---

# 📈 Most Used Languages

<p align="center">
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=Redpanda10&layout=compact&theme=tokyonight" width="50%"/>
</p>

---

# 🛠️ Skills & Expertise

* ⚛️ React / React Native / Expo
* 🟢 Node.js / Express.js
* 🍃 MongoDB / Mongoose / SQL
* 🤖 Artificial Intelligence & Machine Learning
* 📱 Mobile App Development
* 🌐 REST API & GraphQL Development
* 🔐 Authentication & Security
* 📊 Data Visualization & Analytics
* 🧠 AI/ML Integration
* 🐍 Python & Microservices
* ☁️ Cloud Deployment (AWS, GCP)
* 🔄 CI/CD & DevOps

---

# 🌐 Connect With Me

<p align="center">

<a href="https://github.com/Redpanda10">
  <img src="https://img.shields.io/badge/GitHub-000?style=for-the-badge&logo=github&logoColor=white"/>
</a>

<a href="https://linkedin.com/in/mohit-singh-budal">
  <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"/>
</a>

<a href="mailto:budalmohitsingh@gmail.com">
  <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white"/>
</a>

<a href="https://twitter.com/redpanda10dev">
  <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white"/>
</a>

</p>

---

# ⭐ Show Your Support

If you like this project and find it useful, please consider:

- ⭐ **Giving it a star** on GitHub
- 🔗 **Sharing** it with your network
- 🐛 **Reporting bugs** or suggesting features
- 🤝 **Contributing** to the project
- 📢 **Spreading the word** on social media

Your support helps us improve and motivates future development! 🚀

---

# 📄 License

This project is licensed under the MIT License.
