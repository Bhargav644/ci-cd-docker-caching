import Link from "next/link";

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Cool Content App!</h1>
      <p>This application showcases some amazing content and features.</p>
      <nav>
        <ul>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/gallery">Gallery</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
