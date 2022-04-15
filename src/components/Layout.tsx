import styles from "./Layout.module.scss";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: any) => {
	return (
		<div className={styles.container}>
			<Header />
			<main>{children}</main>
			<Footer />
		</div>
	);
};


export default Layout;