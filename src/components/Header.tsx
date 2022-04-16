import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";

const Header = () => {
	return (
		<header className={styles.header}>
			<Link to="/">
				<h1 className={styles.title}>Tinify.pro</h1>
			</Link>
			<nav>
				<ul>
					<li>
						<Link to="/tools">Tools</Link>
					</li>

					<li>
						<Link to="/about">About</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
