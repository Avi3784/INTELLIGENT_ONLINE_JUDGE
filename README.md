# Intelligent Visual Judge

## What is this project?
This is a website where you can write code, run it to see if it works, and learn how computer algorithms work by looking at pictures. 

It has three main parts:
1. A place to write and test code.
2. A place to see how sorting algorithms work using moving dots on a graph.
3. A place to share your answers with other people and see what they wrote.

## How it works

### 1. Code Compiler
When you write code on our website and click submit, the website sends your code to the backend server. The backend creates a safe, isolated space to run your code. It feeds test data into your code and checks if the output matches the correct answer. If your code is too slow or uses too much memory, it stops it. It supports four languages: C++, Java, Python, and JavaScript.

### 2. Algorithm Visualizer
Sorting numbers is a common task in computer science. To help you understand how different sorting methods work, we built a visualizer. It shows numbers as dots on a graph. As the computer sorts the numbers, you can watch the dots move and swap places in real time. We included 15 different ways to sort numbers, so you can see which ones are fast and which ones are slow.

### 3. Community Solutions
When you solve a problem, you can share your code and explain how you did it. Other users can read your explanation and look at your code. If they think your answer is good, they can upvote it. This creates a helpful community where everyone can learn from each other.

### 4. AI Feedback
If your code has an error, our system uses an AI to read your code. The AI will point out where the bug is, tell you how fast your code runs, and give you hints on how to fix it.

## Technology Stack
- **React.js**: Used to build the screens you see and click on.
- **Node.js and Express.js**: Used to run the backend server that processes data and runs your code.
- **MongoDB**: A database used to store users, problems, and community solutions safely.

## How to run it locally
1. Open a terminal and go to the backend folder.
2. Run `npm install` to download all the needed files.
3. Run `npm run dev` to start the backend server.
4. Open a second terminal and go to the frontend folder.
5. Run `npm install` again for the frontend files.
6. Run `npm run dev` to start the frontend website.
7. Open the link it gives you in your web browser.
