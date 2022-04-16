import { Routes, Route } from "react-router-dom";
import ImageCompressor from "./components/ImageCompressor";
import About from "./components/About";
import Tools from "./components/Tools";
import NotFound from "./components/404";
const App = () => {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<ImageCompressor />} />\
				<Route path="about" element={<About />} />
				<Route path="tools" element={<Tools />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
};
export default App;
