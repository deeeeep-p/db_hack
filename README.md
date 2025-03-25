# EcoImpact - Sustainable Living Platform

## APP DEMO VIDEO
 <!-- Replace with your actual video link -->
https://github.com/user-attachments/assets/1bd44daf-9a08-4fce-97ef-e22d122d57c9

EcoImpact is a comprehensive mobile application designed to promote sustainable living through energy tracking, eco-friendly product discovery, community projects, and carbon footprint reduction.

## Key Features

### 1. Carbon Emission Tracking
![carbon](https://github.com/user-attachments/assets/9b5eccbc-a447-4d57-9466-54dfe8a29859)
- Visual breakdown of your carbon emissions by category (Travel, Electricity, LPG Gas)
- Daily step tracking to encourage eco-friendly transportation
- Progress toward monthly carbon reduction goals

### 2. Impact Dashboard
![impact dash](https://github.com/user-attachments/assets/a4ee5486-c854-4ec1-9baf-bef6eb288131)

5-14-34-29-16_f73b71075b1de7323614b647fe394240.jpg)
- Track your sustainability metrics in one place
- View carbon saved, renewable energy projects, and daily goals
- Compete with friends on the leaderboard
- Earn rewards for sustainable actions

### 3. Sustainable Product Marketplace
![products](https://github.com/user-attachments/assets/2894b58e-fce0-455f-9693-0ce308bf44d1)

- Discover handpicked eco-friendly products
- Categories include solar, wind, hydro, and biomass solutions
- Purchase sustainable alternatives for everyday items
- User clicks a picture of their room, and GreenSwap uses computer vision to suggest greener product alternatives using Faiss.


### 4. Community Projects
![projects](https://github.com/user-attachments/assets/0dbc55bf-6e6a-4b98-a984-19321fdb99cb)

- Browse and support local sustainability initiatives
- Track project funding progress
- Participate in community discussions about environmental issues
- A real-time web scraper that surfaces urgent environmental news to highlight investment opportunities in renewable energy projects.

### 5. Electricity Bill Analysis
![bills](https://github.com/user-attachments/assets/82c5d359-dbea-4b0c-a312-a42b1a0447a8)
- Upload and analyze your electricity bills for detailed insights.
- Track electricity consumption patterns over time.
- Receive personalized recommendations for energy savings.
- Compare your usage with average consumption in your area.
- Identify potential areas for reducing your carbon footprint.


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
