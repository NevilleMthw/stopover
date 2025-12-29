# Stopover Flight Search Application

This application consists of a Go backend API and a Next.js frontend. The backend fetches flight data from the Aviasales API and serves it to the frontend, which displays the flight information in a user-friendly interface.

## Prerequisites

- Go (1.16 or later)
- Node.js (18 or later)
- npm, yarn, or pnpm

## Running the Application

### Step 1: Set up the Backend

1. Navigate to the backend directory:
   ```
   cd /path/to/stopover/backend
   ```

2. Create a `.env` file with the following variables (if not already present):
   ```
   AVIASALES_TOKEN=your_token_here
   AVIASALES_MARKER=your_marker_here
   AVIASALES_HOST=your_host_here
   ```

3. Install Go dependencies:
   ```
   go mod tidy
   ```

4. Run the backend server:
   ```
   go run .
   ```

   The server will start on port 8080. You should see log messages indicating that the server has started.

### Step 2: Set up the Frontend

1. Open a new terminal window and navigate to the frontend directory:
   ```
   cd /path/to/stopover/frontend
   ```

2. Create a `.env.local` file with the following variables:
   ```
   # Backend API URL
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/api/flights
   ```

3. Install dependencies:
   ```
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   The frontend will start on port 3000.

### Step 3: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the landing page. Click on the search button to navigate to the flights page, which will display flight data fetched from the backend.

## Testing the Application

1. **Backend Testing**:
   - Verify the backend is running by accessing `http://localhost:8080/api/flights` in your browser or using a tool like curl:
     ```
     curl http://localhost:8080/api/flights
     ```
   - You should receive a JSON response with flight data.

2. **Frontend Testing**:
   - Navigate to `http://localhost:3000` in your browser.
   - Click on the search button to go to the flights page.
   - Verify that flight data is displayed.
   - Test the filtering and sorting functionality.
   - Select a flight to see vendor options.
