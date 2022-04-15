import { Routes, Route } from "react-router-dom";
import ImageCompressor from "./components/ImageCompressor";
import About from "./components/About";
import Contact from "./components/Contact";
const App = () => {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<ImageCompressor />} />\
				<Route path="about" element={<About />} />
				<Route path="contact" element={<Contact />} />
			</Routes>
		</div>
	);
};
export default App;
