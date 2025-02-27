import { BrowserRouter } from "react-router-dom";
import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas } from "./components";
import Resume from "./components/Resume";
import ChatBot from "./components/Chatbot"; // Import ChatBot

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />
          <Hero />
        </div>
        <About />
        <Experience />
        <Tech />
        <Works />
        <Feedbacks />
        <Resume />
        <div className="relative z-0">
          <Contact />
          <StarsCanvas />
        </div>
        <ChatBot /> {/* Add ChatBot */}
      </div>
    </BrowserRouter>
  );
};

export default App;
