The purpose of this project is to replace the traditional announcement board with an interactive, electronic version. The board has three sections: advertisements, sale announcements, and customer wishes. In the advertisement section, the board's owner can add their own advertisements, while the other sections are for customers, who can add their own announcements to the board by scanning the QR code on the board. In addition to HTTP requests, the application uses WebSocket for real-time communication between the client and server.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo/interactive-announcement-board.git
   cd interactive-announcement-board
   ```

2. Install dependencies for the backend:

   ```sh
   cd backend
   npm install
   ```

3. Install dependencies for the frontend:

   ```sh
   cd ../frontend
   npm install
   ```

4. Install dependencies for the announcement form:
   ```sh
   cd ../announcement-form
   npm install
   ```

### Configuration

1. Create a `.env` file in the `backend` directory and add the following environment variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   SECRET=your_jwt_secret
   ```

### Running the Application

1. Start the backend server:

   ```sh
   cd backend
   npm run dev
   ```

2. Start the frontend development server:

   ```sh
   cd ../frontend
   npm run dev
   ```

3. Start the announcement form development server:
   ```sh
   cd ../announcement-form
   npm start
   ```

### Building for Production

1. Build the entire project:
   ```sh
   cd backend
   npm run build:full
   ```
