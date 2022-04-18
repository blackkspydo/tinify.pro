import React from "react";
// import { Link } from "react-router-dom";
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
				<div className={styles.form}>
					<form
						action="https://formsubmit.co/blackkspydo@gmail.com"
						method="POST">
						<input
							type="text"
							name="name"
							placeholder="Your Name"
							required
						/>
						<textarea name="suggestion" id="suggestion" />
						<button type="submit">Submit</button>
					</form>
				</div>
			</div>
		</Layout>
	);
};
export default Tools;
