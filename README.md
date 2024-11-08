# Legislative News Aggregator Frontend

## System Design Considerations

1. News Aggregation

    - Aggregation Strategy: Implement a cron job that regularly fetches news articles from external sources. We could use a third-party news APIs. Depending on the requirements, this job could run hourly or daily.
    - Deduplication: To handle duplicate articles from different sources, I consider implementing a hash-based deduplication mechanism is the best option. Generate a unique hash (based on the title, author, and published date, etc) for each article before saving. If the hash already exists in the database, skip saving the duplicate.

2. Scalability

    - Database Design and Indexing: I use a relational database like MySQL or we can use PostgreSQL also to store articles with indexed fields for state, category, published date, title and description. Indexing these fields will optimize query performance for filtering and searching.
    - Handling Large Volumes of Data: As the database grows, I consider implementing a data partitioning strategy, especially if each state and topic has a large number of associated articles. This would distribute data across multiple database servers to improve access speed.
    - API Performance: I use pagination on the /news endpoint to limit the number of articles returned per request, helping to reduce load on both the backend and frontend.

3. Search Optimization

    - Text Search Indexing: For efficient keyword searches in title and description I implement full-text search indexing. Alternatively, We can consider using a dedicated search engine like Elasticsearch if we are going to handle a very high volume of articles, because it’s optimized for fast text searches and can rank results by relevance.
    - Caching Search Results: Cache frequently searched queries or common filters to reduce database load, particularly if your dataset is very large. You could use Redis or a similar caching mechanism to store popular queries for quick access. In this application I implement a simple in-memory cache to store the search results for a short period of time.
    - Incremental Updates: If our news sources update regularly, we need to consider implementing incremental updates that only fetch and add new articles to the database, rather than replacing existing articles. This would keep the system’s data fresh without fully re-fetching the entire dataset, which can be resource-intensive.

## Frontend Application Technologies

-   TypeScript
-   React
-   React Router Dom
-   TanStack Query
-   Material-UI
-   Zustand
-   Json Web Token
-   Websockets

> Steps to run the applications

1.  Clone the repository
2.  Run `npm install` in the root directory
3.  Fill in the `.env` file, use the `.env.template` file as a guide
4.  Run `npm run dev` in the root directory to start the frontend application

> To improve more this application, I would consider the implementation of automated unit and integration testing. Automated testing provides several benefits, including ensuring code quality, detecting bugs early, and reducing manual testing efforts. Unit tests verify individual components, making it easier to identify issues within specific functions or methods. Integration tests, on the other hand, validate how different components work together, helping to prevent issues in the overall system. Together, these tests increase the reliability, maintainability, and scalability of the codebase, leading to a more stable and high-quality application.

Testing Libraries for React Applications:

-   Jest
-   React Testing Library
-   Cypress
