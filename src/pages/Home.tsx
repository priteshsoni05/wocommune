import React from "react";
import WOCommune from "../components/WOCommune";
import WOProducts from "../components/WOProducts";

const Home: React.FC = () => (
  <main>
    <section style={{ padding: "2rem 0", textAlign: "center" }}>
      <h1>Walker&apos;s Odyssey</h1>
      <p>Welcome to the journey! Explore our communities, events, and products.</p>
    </section>

    <WOCommune />

    <WOProducts />
  </main>
);

export default Home;