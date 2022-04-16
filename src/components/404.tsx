import styles from "./404.module.scss";
import Layout from "./Layout";

const NotFound = () => {
	return (
		<Layout>
			<div className={styles.container}>
				<h1>Chaar Saya Chaar</h1>
				<p>
					Chhaina ta bro timle khojeko page.
					<br />
					URL check hana ta!!!
				</p>
			</div>
		</Layout>
	);
};

export default NotFound;
