# CS465 Portfolio
My portfolio for CS-465: Full Stack Development

## Architecture
This project used multiple frontend approaches, which helped show how different web architectures solve different problems. The Express HTML side used server-side rendered pages with Handlebars templates. This approach was straightforward and worked well for delivering pages directly from the server. JavaScript was then used on the client side to add interactivity and improve the user experience.

The single-page application (SPA) built with Angular worked differently. Instead of reloading the page for every action, the SPA dynamically updated content through API calls. This made the application feel faster and more responsive. Compared to Express-rendered pages, the SPA required more frontend structure, but it created a smoother experience for users.

The backend used MongoDB because it is a NoSQL database that works well with JavaScript-based applications. Since data is stored in flexible JSON-like documents, it fits naturally with Node.js, Express, and Angular. MongoDB also made it easier to store travel package data without needing a rigid relational schema.

## Functionality
JSON is different from JavaScript because JSON is a serialized text-based format used for storing and transferring data, while JavaScript is a programming language used to create logic and behavior. JSON connected the frontend and backend because the Angular frontend sent requests and received responses in JSON format from the Express API. This allowed both sides of the application to exchange structured data efficiently.

During development, I refactored code several times to improve organization and efficiency. One example was moving repeated authentication logic into an Angular interceptor so tokens could be attached automatically to requests. Another example was reusing Angular UI components for displaying trip data instead of rewriting the same layout multiple times. Reusable UI components reduce duplicate code and make future updates easier.

## Testing
API testing involved checking different HTTP methods such as GET, POST, PUT, and DELETE to make sure endpoints returned the expected results. GET was used for retrieving data, POST for creating records, PUT for updating data, and DELETE for removing records. Each endpoint needed to be tested for both successful and failed requests.

Security added another layer of testing because protected endpoints required valid JWT authentication tokens. This meant testing not only normal functionality, but also testing what happened when tokens were missing, expired, or invalid. Understanding methods, endpoints, and security is important because a full stack application must be functional while also protecting user data and restricting unauthorized access.

## Reflection
This course helped me move closer to my professional goals by giving me practical experience building a complete full stack application. Instead of only learning theory, I worked with frontend development, backend APIs, databases, and authentication in one connected project. I developed stronger skills in JavaScript, Angular, Express, Node.js, MongoDB, REST APIs, debugging, and problem solving. I also gained experience working through real development issues such as routing, authentication errors, and database integration.
