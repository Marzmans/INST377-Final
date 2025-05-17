# U.S. Treasury Fiscal Data Dashboard

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

# Developer Manual

This section provides technical documentation for developers who will maintain or utilize this application.

## System Design

- **Frontend**: React-based app
- **Backend**: Node.js functions for API endpoints
- **Database**: Supabase with one table: fiscal_data
- **Deployment**: Vercel
  File Structure is available in the repo.

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

Create a table named fiscal_data in your Supabase project with the following schema:

Example Below:
Col_name - attributes

_fiscal_data schema_
id - Auto incrementing, PK
fiscal_year -

CREATE TABLE fiscal_data (
id SERIAL PRIMARY KEY,
fiscal_year INTEGER NOT NULL,
category TEXT NOT NULL,
amount NUMERIC NOT NULL,
type TEXT NOT NULL
);

```






```
