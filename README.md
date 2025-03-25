# EcoImpact - Sustainable Living Platform

![App Demo Video](link-to-your-demo-video.mp4) <!-- Replace with your actual video link -->

EcoImpact is a comprehensive mobile application designed to promote sustainable living through energy tracking, eco-friendly product discovery, community projects, and carbon footprint reduction.

## Key Features

### 1. Carbon Emission Tracking
![Carbon Emission Breakdown](![Screenshot_2025-03-25-14-29-15-76_f73b71075b1de7323614b647fe394240](https://github.com/user-attachments/assets/4c94d9c2-a9b0-4c74-802e-650694975f51)
)
- Visual breakdown of your carbon emissions by category (Travel, Electricity, LPG Gas)
- Daily step tracking to encourage eco-friendly transportation
- Progress toward monthly carbon reduction goals

### 2. Impact Dashboard
![Impact Dashboard](![Screenshot_2025-03-25-14-29-15-76_f73b71075b1de7323614b647fe394240](https://github.com/user-attachments/assets/759f43a4-41a4-4aaa-82c6-1aedc9007da2)
5-14-34-29-16_f73b71075b1de7323614b647fe394240.jpg)
- Track your sustainability metrics in one place
- View carbon saved, renewable energy projects, and daily goals
- Compete with friends on the leaderboard
- Earn rewards for sustainable actions

### 3. Sustainable Product Marketplace
![Greener Products](Screenshot_2025-03-25-14-34-18-12_f73b71075b1de7323614b647fe394240.jpg)
- Discover handpicked eco-friendly products
- Categories include solar, wind, hydro, and biomass solutions
- Purchase sustainable alternatives for everyday items
- User clicks a picture of their room, and GreenSwap uses computer vision to suggest greener product alternatives using Faiss.


### 4. Community Projects
![Explore Projects](Screenshot_2025-03-25-14-33-16-76_f73b71075b1de7323614b647fe394240.jpg)
- Browse and support local sustainability initiatives
- Track project funding progress
- Participate in community discussions about environmental issues
- A real-time web scraper that surfaces urgent environmental news to highlight investment opportunities in renewable energy projects.

### 5. Project Management
![Project Details](Screenshot_2025-03-25-14-33-39-75_f73b71075b1de7323614b647fe394240.jpg)
- Directly invest in and crowdfund vetted sustainability projects, empowering users to fund a greener future.
- Detailed view of sustainability projects
- Track tasks, budgets, and approvals
- View meeting summaries and progress reports


## Technology Stack

- **Frontend**: React Native (for cross-platform mobile development)
- **Backend**: Node.js with Express, Flask
- **Database**: MongoDB (for flexible data storage)
- **Analytics**: Custom carbon calculation algorithms

## Installation

To get the project running, follow these steps:

**Frontend (React Native Expo):**

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the necessary JavaScript packages:
    ```bash
    npm install
    ```
3.  Start the Expo development server to run the React Native application:
    ```bash
    npx expo start
    ```

**Backend (Node.js Express):**

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the required Node.js packages:
    ```bash
    npm install
    ```
3.  Start the Node.js Express server:
    ```bash
    npm start
    ```

**Python Backend (Flask):**

1.  Navigate to the `python` directory:
    ```bash
    cd python
    ```
2.  Create a virtual environment (recommended to isolate dependencies):
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    * On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```
    * On Windows:
        ```bash
        venv\Scripts\activate
        ```
4.  Install the Python packages listed in `requirements.txt`:
    ```bash
    pip install -r requirements.txt
    ```
5.  Run the Flask application (assuming your Flask app is in `app.py`):
    ```bash
    python app.py
    ```
