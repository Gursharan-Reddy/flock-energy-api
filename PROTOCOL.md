# Protocol Discovery

## 1. System Architecture overview
Contrary to the initial assumption of a purely legacy server-rendered HTML application, inspection of the network traffic reveals that the Urja Meter Ops portal is built using a modern frontend framework, specifically **SvelteKit**. This is evidenced by network requests fetching `__data.json?x-sveltekit-invalidated` for page hydration. 

## 2. Authentication Workflow
* **Login URL:** `https://urja-ops.flockenergy.tech/login`
* **Method:** `POST`
* **Request Format:** The client sends an `Accept: application/json` header, indicating a JSON API rather than a standard URL-encoded form submission. The payload contains the credentials entered in the UI (email and password).
* **Session Management:** Upon a successful `200 OK` response, the server issues a `Set-Cookie` header. 
  * **Cookie Name:** `_Secure-better-auth.session_token`
  * **Security Flags:** `HttpOnly`, `Secure`, `SameSite=Lax`
  * **Expiration:** `Max-Age=3600` (The session token is valid for exactly 1 hour).
  * This cookie must be captured and included in the headers of all subsequent requests to maintain an authenticated state.

## 3. Discovered Internal Endpoints
By observing the network traffic while interacting with the application, several internal APIs were discovered, allowing us to bypass HTML scraping in some areas:

* **POST `/login`:** Handles authentication and issues the session cookie. Returns a `200 OK` JSON response.
* **GET `/search?q=&page=1`:** A hidden internal API endpoint triggered by the frontend to populate the main table. 
  * It accepts a search query parameter (`q=`) and a pagination parameter (`page=1`). 
  * Because this endpoint returns structured data (to populate the 403 total meters shown in the UI), it can be queried directly to retrieve meter lists without needing to parse the DOM using Cheerio.
* **GET `/__data.json`:** SvelteKit uses these endpoints to fetch the serialized data required to render the page components. If other hidden JSON APIs are not found for specific pages (like consumption), the raw data can often be extracted directly from these SvelteKit hydration payloads.

## 4. Quirks & Anomalies
* **Hidden Modernity:** The prompt described the system as an "ageing internal web portal," which usually implies messy HTML tables. However, the discovery of the `search` API and SvelteKit architecture means we can build a much more resilient API wrapper by targeting the underlying JSON endpoints rather than relying on brittle CSS DOM selectors.
* **Pagination:** The UI indicates "403 total" meters, but the initial load utilizes a `page=1` parameter. This confirms that the data is paginated on the backend, and our REST API wrapper will need to either implement its own pagination or iterate through the pages to fetch the complete dataset.