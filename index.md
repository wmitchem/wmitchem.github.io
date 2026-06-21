---
layout: default
title: CS499 Capstone ePortfolio
description: A comprehensive showcase of Software Engineering, Algorithms, and Database Architecture by William Mitchem.
---

# William Mitchem
**Full-Stack Software Engineer** <!--[LinkedIn](#)--> [GitHub](https://github.com/wmitchem) | [Email](mailto:will.a.mitchem@gmail.com) <!--[Live Project Demo](#)-->

---

## Table of Contents
1. [Professional Self-Assessment](#professional-self-assessment)
2. [Informal Code Review](#informal-code-review)
3. [Project Portfolio: The Pokémon Shiny Tracker](#project-portfolio-the-pokémon-shiny-tracker)
    * [Enhancement I: Software Design & Engineering](#enhancement-i-software-design--engineering)
    * [Enhancement II: Algorithms & Data Structures](#enhancement-ii-algorithms--data-structures)
    * [Enhancement III: Databases](#enhancement-iii-databases)
4. [Source Code & Artifacts](#source-code--artifacts)

---

## Professional Self-Assessment

My name is William Mitchem, and I am a Software Engineer finishing my Bachelor of Science in Computer Science with a concentration in Software Engineering at Southern New Hampshire University. Looking back at my coursework and the development of this ePortfolio, I can clearly see how much my skills and professional goals have grown. When I started this program, my focus was mostly on just getting code to compile and function. Now, I feel confident and prepared to actually engineer real-world software.

One of the biggest shifts in my thinking came from courses that asked me to analyze hypothetical shareholder documents and business briefs. Instead of jumping straight into an IDE to write code, I learned how to frame software requirements by thinking like both a product owner and a developer. This helped me understand the importance of **communicating with stakeholders**—figuring out what a client actually needs to solve their business problems and translating that into actionable code. While the majority of my coursework required highly independent problem-solving, this independence actually shaped my philosophy on **collaborating in a team environment**. I learned that writing clear, strictly documented code and maintaining clean version control via Git is essential for asynchronous teamwork, ensuring that any future developer can easily inherit, understand, and contribute to my codebase.

My technical foundation goes deeper than just high-level application development. During my program, I gained hands-on experience with low-level systems, learning to reverse-engineer compiled binaries by viewing the raw assembly code, analyzing common registers and control flow statements, and manually reconstructing the original C++ logic. I also explored computer graphics using OpenGL, where I implemented custom shaders and built object meshes to render interactive 3D scenes. As I transitioned these lower-level and Object-Oriented concepts into modern, full-stack web development, I built a practical grasp of the core areas of computer science:

* **Software Engineering and Databases:** I have learned how to design applications that cleanly separate the visual user interface from the underlying state logic, making code much easier to maintain. I also gained hands-on experience designing NoSQL Document databases (like MongoDB) that can handle complex, deeply nested data relationships rather than just simple, flat text fields.

* **Data Structures and Algorithms:** I used to think of algorithmic complexity as just a textbook concept, but this project showed me its practical value. By writing custom data structures to filter and sort thousands of data records directly in the user's browser memory, I was able to eliminate server lag and make the application feel instantly responsive.

* **Security:** This program taught me to develop with a security mindset—essentially, trying to break my own code before an attacker can. From managing complex user authentication to ensuring sensitive data is hashed and server routes are protected by proper middleware, I've learned how to prioritize user privacy and data integrity.

### Portfolio Overview & Artifact Introduction

The artifacts you will see in this portfolio represent the culmination of everything I've learned. For my capstone, I chose to take a basic, school-assigned travel booking website (built previously in my Full Stack Development course) and completely transform it into a comprehensive Pokémon Tracker. This passion project allowed me to push my limits across software design, data structures, and database management. The three enhancements below detail how I migrated a legacy codebase to a modern React architecture, built custom algorithms to handle massive data payloads, and secured the backend database. Together, they turn a standard academic assignment into a cohesive, optimized application that I am genuinely proud of.

---

## Informal Code Review

Before writing any new code for my capstone, I recorded an informal code review of the original travel agency project I built for my Full Stack Development class. Walking through the old MEAN stack codebase helped me figure out exactly what I needed to fix—like organizing the files better, tightening up security, and figuring out how to handle data more efficiently—before I started transforming the app into the Pokémon Tracker.

* **[View the Informal Code Review Video on Google Drive ↗](https://drive.google.com/file/d/16mDdnEwSYKeeSo-IiISsnZ7LC9B-4Nho/view?usp=sharing)**

---

## Project Portfolio: The Pokémon Shiny Tracker
**Tech Stack:** React 19, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, Mongoose

### Enhancement I: Software Design & Engineering

The artifact I chose to enhance is a full-stack Single Page Application (SPA) originally created for my CS 465: Full Stack Development course. The original project was built using the MEAN stack (MongoDB, Express, Angular, Node.js) and served as a basic travel booking website for a fictitious agency called Travlr. I chose this specific project because it provided a solid foundation to meet all three capstone enhancements, while also giving me the flexibility to completely pivot its purpose. I wanted to turn it into something I am personally passionate about—a comprehensive Pokémon Shiny Tracker—which aligns perfectly with the software engineering career path I want to pursue after graduation.

For my first enhancement, which focused on Software Design and Engineering, my primary goal was to migrate the frontend from Angular to React. Most of my previous coding experience has been heavily focused on Object-Oriented Programming (OOP) using languages like C#, C++, Java, and Python. While Angular felt like a natural extension of that class-based system, React relies heavily on a functional programming paradigm that I wasn't as familiar with. I chose this migration specifically to challenge myself and gain experience thinking about software architecture in a completely new way.

The transition from Angular to React was a steep learning curve. Angular is very opinionated and monolithic, meaning there is usually one specific way to build a feature. React, on the other hand, gave me a lot more freedom to piece together my own stack, but that meant I had to be much more careful about how I organized my files and state. I decided to use TypeScript instead of plain JavaScript to help bridge the gap, as it brought back some of the strict type-safety and structure I was used to from my OOP background.

Another major part of this enhancement was overhauling the user interface. The original Angular project relied heavily on Bootstrap, which caused several styling conflicts when I tried to implement modern features like a dark mode toggle. Because many of Bootstrap's background classes are internally marked as important in the CSS cascade, elements were refusing to update properly. To fix this and clean up the project's dependencies, I completely stripped out Bootstrap and reworked all of my components using Tailwind CSS, which allowed me to create a much more flexible and responsive layout.

Overall, this first enhancement really deepened my understanding of the separation of concerns. By isolating the stateful parts of my application (like the main pages) from the generic visual elements (like buttons and cards), I learned how to build truly reusable UI components. It was a challenging process making sure the new frontend communicated smoothly with the existing backend, but it gave me a much stronger grasp on modern web development.

* **[Read the Full Enhancement I Narrative Here](assets/module3-narrative.pdf)**

### Enhancement II: Algorithms & Data Structures

For my second enhancement, focusing on Algorithms and Data Structures, I needed to figure out how to process and filter massive amounts of data from an external source without ruining the application's performance. Because my new tracker relies on data for over 1,000 different Pokémon, fetching information individually from the external PokéAPI was going to cause severe lag. Every time a user typed a letter in the search bar, the app would freeze while waiting for the server to respond.

To solve this, I built a custom utility class called `CollectionQuery`. Instead of relying on the server to constantly filter the data, my application fetches the complete list of Pokémon once when the app loads and caches it in the user's browser memory. The `CollectionQuery` utility then uses custom algorithms to quickly sort and filter that local array based on whatever the user is searching for or clicking on. This completely eliminated the network delay and made the interface feel instantly responsive.

In addition to filtering, I wanted the application to accurately simulate the game's actual mechanics rather than just using basic, static numbers for the shiny hunting odds. To do this, I developed a Dynamic Probability Calculator. I spent time researching the complex math behind different in-game hunting methods—such as the Poké Radar or Masuda Method—and built algorithms that calculate the cumulative probability of finding a shiny Pokémon over a series of variable encounters and chain lengths.

This enhancement pushed me to really understand how React handles state and data rendering. In my earlier work with React, I was mostly just swapping simple visual components. But dealing with these more complex algorithms forced me to dive deep into hooks like `useEffect` and `useMemo`. I actually ran into an issue where the app would get stuck in an infinite fetch loop because I didn't properly manage my dependency arrays, which taught me exactly how the React component lifecycle operates under the hood.

Looking back on this phase of the project, I feel I learned a tremendous amount about the mechanics of data management in a web application. It was incredibly satisfying to see how writing efficient, client-side algorithms could take a slow, server-dependent application and turn it into a lightning-fast experience for the end user.

* **[Read the Full Enhancement II Narrative Here](assets/module4-narrative.pdf)**

### Enhancement III: Databases

My third enhancement centered on Databases. The original Travlr application had a very basic database architecture that simply stored flat text descriptions of trips in MongoDB. Because I was transforming the app into a detailed Pokémon tracker, I needed to expand the database complexity significantly to handle deeply nested data, specific user interactions, and strict relational references between different data models.

I started by redesigning the Mongoose schemas to ensure strict data integrity. I added required data types and enumerations so the database would reject invalid entries—for example, making sure that a user could only select from valid game generations or specific hunting methods. I also transitioned the entire Node.js Express backend from JavaScript to TypeScript. This was a crucial step because it allowed me to share the exact same data models between my React frontend and my backend database, ensuring that if a data requirement changed, the compiler would catch any mismatches immediately.

One of the biggest hurdles was dealing with the messy, fragmented data from the external PokéAPI. Instead of forcing the user's browser to piece together dozens of different API endpoints just to view a single Pokémon's stats, I wrote a one-time database seeding script. This script acts as an automated pipeline that reaches out to the API, extracts all the scattered data, cleans it up into a single streamlined format, and saves it directly into my local MongoDB database. This way, my application only ever has to make one simple query to my own database to get everything it needs.

I also had to optimize how the application communicates with the database during active use. When a user is rapidly clicking a button to count their encounters, waiting for the server to process every single click causes a noticeable delay on the screen. Initially, I tried using a database-level increment operator to solve this, but the network lag was still ruining the user experience. To fix this, I shifted to a client-side state management approach. Instead of relying on the database to do the math, I wrote the React frontend to instantly process all the complex changes itself—such as tracking total encounters, capping the chain limit at 40, and logging the history of when a chain breaks. Because React handles this in memory, the screen updates immediately for the user. Then, the application silently syncs that new data to the Node.js backend in the background without making the user wait for a response. By removing the network delay from the equation, the interactive counters remain perfectly responsive no matter how fast the user clicks.

Reflecting on this final enhancement, time management ended up being my biggest challenge, as I quickly realized that the algorithm and database changes heavily relied on one another and had to be built simultaneously. Despite that, completing this database overhaul was a great learning experience. It tied the whole project together and taught me how to think about software not just as a user interface, but as a complete, secure pipeline from the client all the way down to the database storage.

* **[Read the Full Enhancement III Narrative Here](assets/module5-narrative.pdf)**

---

## Source Code & Artifacts

* **Original Legacy Codebase:** [GitHub Repository](https://github.com/wmitchem/wmitchem.github.io/tree/main/original-artifact)
* **Enhanced Production Codebase:** [GitHub Repository](https://github.com/wmitchem/wmitchem.github.io/tree/main/new-artifact)
<!-- * **Live Application Deployment:** [View the Live App Here](#) -->
