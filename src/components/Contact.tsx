import React from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import styles from "./Header.module.scss";

const Contact = () => {
	return (
		<Layout>
			<div className={styles.container}>
				<h1>Contact</h1>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Consequatur, quisquam.
				</p>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Consequatur, quisquam.
				</p>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Consequatur, quisquam.
				</p>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Consequatur, quisquam.
				</p>
			</div>
		</Layout>
	);
};
export default Contact;