import React from "react";
import Layout from "./Layout";
import styles from "./Header.module.scss";

const About = () => {
	return (
		<Layout>
			<div className={styles.container}>
				<h1>About</h1>

				<p>
					Tinify.pro is a free online image compression tool. It
					supports different image formats and compression rates. Here
					are some notable features:
				</p>
				<ul>
					<li>
						It supports client side compression (means extremely
						secure)
					</li>
					<li>
						There is no limit in number of files you can compress
					</li>
					<li>
						YES, you can compress multiple files at once (guess what
						there is no limit either, You can throw as many files
						your device can handle)(I don't recommend more than 100
						at once, might freeze your device because of RAM
						overload)
					</li>
					<li>
						You have two download options, downloading a single file
						or download all compressed files as once as a zip.
					</li>
					<li>
						It supports different formats (jpg,png,webp,gif,svg+xml)
					</li>
					<li>
						It supports inter-format conversions like jpg{" -> "}
						png, png{" -> "}jpg, jpg,png{" -> "}webp.
					</li>
					<li>
						It supports different compression rates (0.6-0.8 is
						recommended)
					</li>
					<li>
						It supports different image sizes (up to 50MB
						recommended)
					</li>
					<li>
						It supports resizing images to different resolutions.
					</li>
					<li>
						This tool is made with React as PWA and is client side
						processing, which means even if you don't have network
						connection you can make it work.
					</li>
					<li>
						You can install it natively in to your device as PWA.
					</li>
				</ul>
			</div>
		</Layout>
	);
};
export default About;
