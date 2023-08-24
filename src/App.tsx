import { Routes, Route } from "react-router-dom";
import ImageCompressor from "./components/ImageCompressor";
import About from "./components/About";
import Tools from "./components/Tools";
// import { useEffect } from "react";
import NotFound from "./components/404";
// import ReactGA from "react-ga4";

const App = () => {
	// const trackingID: string = process.env.REACT_APP_GA_TRACKING_ID!;
	// console.log(trackingID);
	// useEffect(() => {
	// 	ReactGA.initialize(trackingID);
	// 	ReactGA.send("pageview");
	// }, [trackingID]);
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<ImageCompressor />} />
				<Route path="/about" element={<About />} />
				<Route path="/tools" element={<Tools />} />
				<Route path="/*" element={<NotFound />} />
			</Routes>
		</div>
	);
};
export default App;
