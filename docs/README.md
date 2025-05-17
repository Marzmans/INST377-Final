# U.S. Treasury Fiscal Data Dashboard
Vercel Deployment: https://inst-377-final-chi.vercel.app/
## Overview

This web application provides an interactive interface for exploring U.S. Treasury fiscal data. The dashboard simplifies access to government revenue and spending data for students, researchers, and anyone interested in U.S. fiscal policy. The application fetches data directly from the Treasury Fiscal Data API, processes it, and stores it in a Supabase database. Users can view summary statistics, explore detailed data through an interactive table, and visualize trends through charts.

## Features

- Real-time fiscal data retrieval from the U.S. Treasury API
- Interactive data tables with search and pages to sift through data
- Visual representation of revenue and spending through charts
- Summary statistics showing revenue, spending, and deficit amounts
- Modern and responsive interface that works across devices

## Target Browsers

This application is designed to work on contemporary desktop and mobile browsers (MacOS, IOS, Android, Windows, Linux).
The Vercel deployed website is created to adapt to all screen sizes.

[View Developer Manual](#developer-manual)

<a id="developer-manual"></a>
# Developer Manual

This section provides technical documentation for developers who will maintain or utilize this application.

## System Design

- **Frontend**: React-based app
- **Backend**: Node.js functions for API endpoints
- **Database**: Supabase with one table: fiscal_data
- **Deployment**: Vercel
  File Structure is available in the repo.

...

## Installation

### Prerequisites

- Node.js
- npm
- A Supabase account with a DB set up

### Environment Variables

Create a .env file in the root directory with the following variables:

SUPABASE_URL=[url provided on Supabase website, specific to one's account]
SUPABASE_KEY=[Key provided on Supabase website, specific to one's account]

### Supabase DB Setup
Disable RLS
Create a table named fiscal_data in your Supabase project with the following schema:

Example Below:
Col_name - attributes

fiscal_data schema_
id - Auto incrementing, PK - int8 (Automatically created by Supabase)
created_at - timestamptz (Automatically created by Supabase)
fiscal_year - int2
category - text 
amount - numeric
type - text

### Installation Steps

1. Clone the repo:
   git clone https://github.com/Marzmans/INST377-Final.git
   cd INST377-Final

2. Install dependencies using cmd within the project root folder:
   npm install

3. Install frontend dependencies:
   cd frontend/inst377-final
   npm install

## Running the Application Locally
Start the frontend development server:
   cd frontend/inst377-final
   npm run dev

### Production Build

1. Build the frontend:
   cd frontend/inst377-final 
   npm run build

2. Deploy to Vercel:
    Login/Create Vercel Account
    Import project from Github
    Configure environment variables of deployment:
        Copy and paste SUPABASE_URL = [url] and SUPABASE_KEY = [key] into environment variables
    Navigate to framework settings and override/change these settings:
        Framework preset: Other
        Build Command: cd frontend/inst377-final && npm install && npm run build
        Install Command: npm install

## API Documentation
The application uses the following API endpoints:

### 1. GET /api/getStoredData
Retrieves all fiscal data stored in the Supabase database. This endpoint returns fiscal data objects including fiscal year, category, amount, and type information.

### 2. POST /api/fetchAndStoreYTD
Fetches the latest fiscal year-to-date data from the U.S. Treasury API, processes it, and stores it in the Supabase database. This endpoint connects to the Treasury Fiscal Data API, filters the data for relevant fiscal indicators, transforms it into the required format, and inserts it into the database. The Treasury Fiscal Data API can be found in the TreasuryURL Variable. 

### 3. POST /api/storedata
Directly stores a fiscal data record in the Supabase database. This endpoint accepts fiscal data in the request body (fiscal_year, category, amount, and type) and inserts it as a new record in the database.

## Testing
Currently, the application does not have automated tests. Manual testing can be performed by:
1. Running the application locally through npm commands above
2. Clicking the "Load Data" button to fetch Treasury data
3. Navigating between pages to check page routing
4. Checking that data tables and charts display correctly

## Future Development
Potential areas for enhancement:
- Adding automated tests with Jest and React Testing Library
- Adding more visualization options (line charts, pie charts)
- Expanding the data to include historical fiscal years for comparison

## Known Issues
- The Treasury API occasionally returns incomplete data sets, which may affect visualization and data table accuracy and performance

