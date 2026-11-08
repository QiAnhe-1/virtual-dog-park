/* Basic page layout */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
  color: #222;
  background-color: #f7f9fc;
}

/* Header */
header {
  background-color: #5a8df0;
  color: #fff;
  padding: 24px 16px;
  text-align: center;
}

header h1 {
  font-size: 2rem;
  margin-bottom: 8px;
}

.welcome {
  font-size: 1.05rem;
  max-width: 640px;
  margin: 0 auto;
}

/* Main content */
main {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
}

.encyclopedia h2 {
  margin-bottom: 16px;
  font-size: 1.6rem;
}

/* Breed cards */
.breed-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.breed-card img {
  display: block;
  max-width: 100%;
  height: auto;
  margin-bottom: 12px;
  border-radius: 8px;
}

.breed-card h3 {
  font-size: 1.3rem;
  margin-bottom: 8px;
}

.breed-card p {
  margin-bottom: 8px;
}

/* Footer */
footer {
  text-align: center;
  padding: 16px;
  font-size: 0.9rem;
  color: #555;
}

/* Mobile-friendly layout */
@media (max-width: 600px) {
  header h1 {
    font-size: 1.6rem;
  }

  .welcome {
    font-size: 0.95rem;
  }

  .encyclopedia h2 {
    font-size: 1.3rem;
  }

  .breed-card h3 {
    font-size: 1.15rem;
  }
}