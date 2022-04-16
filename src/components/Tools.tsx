import React from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import styles from "./Header.module.scss";

const Tools = () => {
	return (
		<Layout>
			<div className={styles.container}>
				<h1>Tools</h1>
				<p>
					More tools will be added in the future.
					<br />
					Let me know If you have any suggestions.
				</p>
			</div>
		</Layout>
	);
};
export default Tools;
