import styles from "./Layout.module.scss";
import Header from "./Header";
import Footer from "./Footer";
const Layout = ({ children }: any) => {
	
	// console.log(trackingID);
	// ReactGA.send({
	// 	eventAction: "pageview",
	// 	eventCategory: "Layout",
	// 	eventLabel: "Layout",
	// });

	return (
		<div className={styles.container}>
			<Header />
			<main>{children}</main>
			<Footer />
		</div>
	);
};

export default Layout;
