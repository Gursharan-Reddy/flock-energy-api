## Reflection

What assumptions did you make?
I assumed that the legacy portal relies primarily on server-side rendered HTML rather than dynamically loading data via heavily obfuscated client-side JavaScript post-load. This assumption drove the decision to use Cheerio for fast HTML parsing instead of a heavier headless browser like Puppeteer. I also assumed the session cookie lifecycle is standard; thus, handling 401s or login redirects on the fly is a sufficient auto-reauthentication strategy, rather than building a background "keep-alive" worker.

Which part was the most difficult, and how did you get unstuck?
The most difficult part was ensuring the scraper could reliably handle the legacy DOM structure, particularly accounting for missing fields, inconsistent data formatting, or empty table rows. Writing brittle CSS selectors is a common pitfall. To get unstuck, I leaned heavily on Chrome DevTools to inspect the raw network responses, saved snippets of the portal's HTML locally, and wrote isolated test scripts to perfect my Cheerio selectors before integrating them into the main application flow.

If you had another day, what would you improve?
I would implement an in-memory or Redis caching layer. Hitting a legacy portal for every single API request is inefficient and risks overloading their aging infrastructure. Caching the meter data with a reasonable TTL (Time-To-Live) would drastically improve response times for downstream clients. Additionally, I would tackle the optional network hierarchy extension by building a recursive parser to map out the exact relationships between the meters.

What mistake did you make while solving this?
Initially, I underestimated the requirements for session persistence. I started by making standard HTTP requests, which successfully hit the login endpoint but immediately failed on subsequent data fetches. I quickly realized my mistake—the portal requires stateful interactions—and corrected it by introducing axios-cookiejar-support and tough-cookie to persist the session cookie globally across the application's lifecycle.

If you were reviewing your own submission, what would you criticise?
I would criticize the inherent fragility of relying on DOM selectors. While the API currently works seamlessly, it is tightly coupled to the legacy portal's UI. If the utility company changes a single CSS class name or table structure in the future, the endpoints will fail. For a production environment, I would suggest adding robust monitoring and alerting to immediately detect parsing failures, as well as abstracting the parsing logic further into dedicated adapter classes to make future updates easier.