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

I am William Mitchem, a computer science student finalizing my degree at Southern New Hampshire University. My academic concentration is in Software Engineering, which aligns exactly with the career path I intend to pursue after graduation. Most of my previous coursework and personal projects focused heavily on object-oriented programming using languages like C++, Java, and Python. Because of this, I wanted my capstone to challenge me to think about architecture in an entirely new way. I decided to pivot into modern, functional web development by engineering a full-stack React 19 application.

This ePortfolio highlights my growth throughout the program by walking through how I transformed a basic, legacy MEAN-stack travel application into a fully featured Pokémon tracking platform. Through this process, I demonstrated my understanding of the core Computer Science outcomes:

* **Software Design and Engineering:** I migrated the application away from a rigid Angular setup into a highly modular React 19 architecture. I also completely rewrote the backend from JavaScript to TypeScript. This allowed me to establish a "single source of truth" for my data models across both the frontend and backend, eliminating redundant code and making the application much easier to maintain.

* **Algorithms and Data Structures:** To ensure the user interface was fast and responsive, I engineered a custom `CollectionQuery` utility. Instead of relying on the server to sort and search data, this utility handles complex array transformations directly in the user's browser in $O(n)$ time. I also researched and implemented mathematical probability algorithms to accurately calculate dynamic encounter odds for the user's active hunts.

* **Databases:** I expanded the original project's simple database into a robust MongoDB architecture utilizing strict Mongoose schemas. To populate this database, I built a custom Node.js ETL (Extract, Transform, Load) pipeline. This script fetches massive amounts of fragmented data from a third-party API, strips away the unnecessary bloat, and loads only the optimized data into my database for rapid client consumption.

* **Security Mindset:** I applied defensive programming principles throughout the application's lifecycle. By enforcing strict TypeScript rules, the compiler acts as an automated defensive layer that catches malformed data before it interacts with the database. Furthermore, I implemented secure JWT authentication middleware to explicitly halt unauthorized network requests, adhering to the principle of least privilege.

Throughout the development of this capstone, I also focused heavily on **Professional Communication** and building **Collaborative Environments**. Presenting my work meant taking complex engineering concepts—like algorithmic time complexity and NoSQL structures—and explaining them clearly in my written narratives and my code review video. Within the code itself, I implemented comprehensive TSDoc comments across my components and utilities. By thoroughly documenting my interfaces, parameters, and return values, I ensured that my codebase could be easily read, maintained, and collaborated on by other developers in a professional environment.
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
