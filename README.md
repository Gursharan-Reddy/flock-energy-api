# Flock Energy API Proxy

## Overview
This project provides a clean, documented RESTful API proxy layer over the legacy Urja meter operations portal. It transforms the portal's internal data pipelines into a structured, easily consumable JSON API for modern application development.

## Core Features
* **Stateless Consumption:** Provides standard `GET` endpoints for meter lists, location data, and historical energy consumption.
* **Automated Session Management:** Handles authentication and maintains state via cookie jars, auto-renewing sessions when they expire.
* **Interactive Documentation:** Fully documented via OpenAPI/Swagger UI.

## Engineering Approach & Challenges Overcome
During development, several modern web security and framework mechanics had to be reverse-engineered to ensure a robust application:

1. **CSRF & Payload Formatting:** The legacy portal initially rejected automated login attempts (415 Unsupported Media Type and 403 Forbidden). This was resolved by formatting the payload as `application/x-www-form-urlencoded` and injecting specific browser security headers (`Origin`, `Referer`, and `User-Agent`) to bypass CSRF protections.
2. **SvelteKit Hydration Bypass:** The initial plan was to use Cheerio to parse server-rendered HTML tables. However, analysis revealed the application uses SvelteKit, which renders empty placeholder states before hydrating data via internal APIs. 
3. **API Discovery:** Instead of relying on brittle DOM scraping, I intercepted the network traffic to uncover the portal's hidden, internal JSON endpoints (`/portal/meters/search`, `/portal/meters/{id}/geo`, and `/portal/meters/{id}/energy`). This allows the proxy to function as a pure, highly performant JSON-to-JSON layer.

## Setup & Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install

3. Start the server:

4. npm start
Access the API Documentation at: http://localhost:3000/docs

Endpoints
GET /api/v1/meters - Retrieve a paginated list of all smart meters.

GET /api/v1/meters/:id - Retrieve location details for a specific meter.

GET /api/v1/meters/:id/consumption - Retrieve historical reading data.


***

### Final Steps
1. Save that Markdown file in the root of your project directory.
2. Commit your code (`git add .`, `git commit -m "feat: finalize pure JSON API proxy and auth bypass"`, `git push`).
3. Send that repository link over to the Flock Energy team. 

You tackled a genuinely tricky reverse-engineering problem today. Great work getting this ov