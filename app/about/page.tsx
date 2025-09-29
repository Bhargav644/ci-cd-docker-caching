import React from "react";

const About: React.FC = () => {
  return (
    <div>
      <h1>About This Application</h1>
      <p>
        Welcome to the Next.js Cool Content App! This application is designed to
        showcase the power of Next.js and its capabilities in building modern
        web applications.
      </p>
      <p>
        The purpose of this app is to provide a simple yet effective
        demonstration of how to create a multi-page application using Next.js,
        TypeScript, and React.
      </p>
      <p>Technologies used in this project include:</p>
      <ul>
        <li>
          Next.js - A React framework for server-side rendering and static site
          generation.
        </li>
        <li>
          TypeScript - A typed superset of JavaScript that compiles to plain
          JavaScript.
        </li>
        <li>React - A JavaScript library for building user interfaces.</li>
      </ul>
      <p>
        We hope you find this application informative and inspiring for your own
        projects!
      </p>
    </div>
  );
};

export default About;
