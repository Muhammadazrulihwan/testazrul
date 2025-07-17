import IdeasList from "./IdeasList";
import Header from "./Header";
import Banner from "./Banner";

function App() {
  return (
    <>
      <Header />
      <Banner />
      <main style={{ paddingTop: 80 }}>
        <h1 style={{ textAlign: "center", marginTop: 32 }}></h1>
        <IdeasList />
      </main>
    </>
  );
}

export default App;
