Note: This assignment is designed to evaluate your engineering depth, your ability to handle browser hardware, and your understanding of React's rendering lifecycle. We are not just looking for a "working" app, but one that is architecturally sound, performant, and secure.
Assignment: Employee Insights Dashboard
Project Overview
You are tasked with building a 4-screen Employee Insights Dashboard. While the functional requirements seem straightforward, the engineering constraints are designed to test your mastery of the DOM, state synchronization, and performance optimization.
Hard Constraints
Zero UI Libraries: You are not allowed to use MUI, Ant Design, Bootstrap, or any pre-made component libraries. Use raw Tailwind CSS or Standard CSS/Modules.
Zero Utility Libraries for Core Logic: You are not allowed to use react-window or react-virtualized. All scrolling and virtualization math must be your own
Intentional Vulnerability: Your submission must intentionally contain exactly one performance or logic bug (e.g., a stale closure, a missing dependency leading to a re-render loop, or a memory leak). You must document this in your README. Code without this vulnerability will be automatically rejected.
Git Integrity:Regular and meaningful commits are required. Large single-push repositories will not be evaluated.
Features
A. Secure Authentication (Login)
Credentials: Username: testuser | Password: Test123
Logic: Implement a persistent Auth Provider using the Context API.
Security: If a user manually types /list without logging in, they must be redirected. If a logged-in user refreshes the page, the session must persist (use localStorage).

B. The High-Performance Grid (List Page)
API Endpoint: 
POST to https://backend.jotish.in/backend_dev/gettabledata.php
Payload: { "username":"test", "password":"123456" }
Custom Virtualization: Since datasets can be large, you must implement Custom Virtualization. Only render rows visible in the viewport plus a small buffer.
C. Identity Verification (Details Page)
Dynamic Routing: Accessible via /details/:id.
Camera API: Implement a native camera interface to capture a profile photo.
Signature Overlay: Once a photo is captured, overlay an HTML5 Canvas. The user must sign their name using a mouse or touch directly over the captured photo.
The "Blob" Merge: You must programmatically merge the photo and the signature into a single image file (Base64 or Blob).
Data Visualization (Photo Result / Analytics Page)
Image Display: Show the final merged "Audit Image" (Photo + Signature).
Custom SVG Chart: Using the API data, represent the Salary Distribution per City using raw SVG elements (Bars/Circles). Do not use Chart.js or D3.
Geospatial Mapping: Represent the cities on a map. If you use a map library (like Leaflet), you must explain how you handled the city-to-coordinate mapping.
Expected Deliverables
A. Source Code: Link to GitHub repository.
The README documenting your Intentional Bug: What is it, where is it, and why did you choose it?
Technical explanation of your Virtualization Math.
B. End-to-End Screen Recording
A walkthrough of the app.
The Explainer Section: You must spend max 60 seconds of the video explaining the code logic behind the Image Merging and the Scroll Offset calculations

