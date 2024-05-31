import { CreateAsset } from "../components/createAsset/createAsset";
import { LandingPage } from "../components/landingPage/landingPage";
import { ShareFractionalNFT } from "../components/shareFractionalNFT/shareFractionalNFT";
import { DataConsumer } from "../components/dataConsumer/dataConsumer";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/artist" element={<CreateAsset />} />
          <Route path="/consumer" element={<DataConsumer />} />
          <Route path="/consumer1" element={<ShareFractionalNFT />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
