# MORVA — Learn Morse Code

**Learn Morse code. Practice your skills. Track your progress.**

MORVA is an interactive web platform designed to help users learn and practice Morse code. Explore the Morse alphabet, discover words in the dictionary, test your knowledge with quizzes, and compete with other learners on the leaderboard.

## Live Demo

🌐 **Website:** https://morva-luka.netlify.app/

💻 **GitHub Repository:** https://github.com/lxka806/MORVA

## Features

* **Morse Code Alphabet** — Learn the Morse code representations of letters and numbers.
* **Dictionary** — Explore words and their Morse code translations.
* **Interactive Quizzes** — Test your knowledge and improve your skills.
* **Leaderboard** — Compare your progress with other users.
* **Learning Platform** — Practice Morse code in an interactive environment.
* **Responsive Design** — Use the platform on different screen sizes.

## Tech Stack

The project uses modern web development technologies to provide an interactive user experience.

* HTML
* CSS
* JavaScript
* React *(if used in the current version)*

## Getting Started

Follow these steps to run MORVA locally.

### 1. Clone the Repository

```bash
git clone https://github.com/lxka806/MORVA.git
```

### 2. Navigate to the Project

```bash
cd MORVA
```

### 3. Install Dependencies

Install the frontend and backend dependencies separately:

```bash
cd frontend
npm install
cd ../backend
npm install
```

### 4. Configure and Start

Set `MONGODB_URL` and `JWT_SECRETE` in the backend environment, then run:

```bash
cd backend
npm start
```

Set the frontend `VITE_API_URL` to the backend URL, then start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

The backend also accepts `PORT` (default `3000`), `MONGO_MAX_POOL_SIZE` (default `10`), `SLOW_REQUEST_THRESHOLD_MS` (default `500`), and `SLOW_DB_THRESHOLD_MS` (default `100`). Keep environment files out of source control.

Run backend tests with `cd backend && npm test`.

## Project Goals

MORVA aims to make learning Morse code more accessible, engaging, and practical through interactive lessons, quizzes, and progress tracking.

## Contributing

Suggestions and improvements are welcome. Feel free to fork the repository and submit a pull request.

## Author

**Luka Ivanishvili**

* GitHub: [@lxka806](https://github.com/lxka806)
* Website: [MORVA](https://morva-luka.netlify.app/)

---

If you find MORVA useful, consider giving the repository a ⭐ on GitHub!
