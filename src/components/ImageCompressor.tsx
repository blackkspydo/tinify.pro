import { useState, useRef, useEffect } from "react";
import Compressor from "compressorjs";
import { ComparisonSlider } from "react-comparison-slider";
import styles from "./ImageCompressor.module.scss";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Layout from "./Layout";
import { RiDeleteBinLine } from "react-icons/ri";
import compareImg from "../static/profile.jpg";
import InstallBanner from "./InstallBanner";
import ReactGA from "react-ga4";
interface BlobObjInterface {
	file: File | Blob;
	name: string;
	url: string;
	size: number;
	status: string;
}
interface image {
	file: File | Blob;
	name: string;
	url: string;
	size: number;
}

interface ImagesInterface {
	original: image;
	compressed: image;
}
function ImageCompressor() {
	// analytics

	// send button click analytics
	const ANALYTICS_importedImage = () => {
		ReactGA.event({
			category: "Button",
			action: "imported_image",
			label: "imported",
		});
	};
	// send download analytics
	const ANALYTICS_singleDownload = () => {
		ReactGA.event({
			category: "Button",
			action: "single image download",
			label: "Single image download",
		});
	};
	// send download analytics
	const ANALYTICS_zipDownload = () => {
		ReactGA.event({
			category: "Button",
			action: "zip download",
			label: "Zip download",
		});
	};

	const [images, setImages] = useState<ImagesInterface[]>([]);
	const [blobs, setBlobs] = useState<BlobObjInterface[]>([]);
	// eslint-disable-next-line
	const [isTablet, setIsTablet] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isFirst, setIsFirst] = useState(0);
	const [compare, setCompare] = useState<any>({
		original: {
			file: null,
			name: "",
			url: compareImg,
			size: 0,
		},
		compressed: {
			file: null,
			name: "",
			url: compareImg,
			size: 0,
		},
	});
	const [controls, setControls] = useState<any>({
		maxWidth: 1200,
		maxHeight: 1200,
		quality: 0.8,
		type: "auto",
	});
	const [controlsValue, setControlsValue] = useState<any>({
		maxWidth: 800,
		maxHeight: 800,
		quality: 0.8,
		type: "auto",
	});

	const [isHovering, setIsHovering] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const nameShorter = (file: File) => {
		if (file.name.length > 20) {
			return (
				file.name.split("").splice(0, 12).join("") +
				"..." +
				file.name.split("").splice(-10).join("")
			);
		}
		return file.name;
	};

	const handleImageCompression = async () => {
		if (blobs) {
			await blobs.sort().forEach((image) => {
				image.status === "pending" &&
					new Compressor(image.file, {
						quality:
							controlsValue.quality > 1
								? 1
								: controlsValue.quality < 0.1
								? 0.1
								: controlsValue.quality,
						strict: true,
						success(result) {
							setImages((prevState: ImagesInterface[]) =>
								Array.from(
									new Set([
										...prevState,
										{
											original: {
												file: image.file,
												name: image.name,
												url: URL.createObjectURL(
													image.file
												),
												size: image.size,
											},
											compressed: {
												file: result,
												name: image.name,
												url: URL.createObjectURL(
													result
												),
												size: result.size,
											},
										},
									])
								)
							);
							image.status = "done";
						},
						error(err) {
							toast.error(`${image.name} failed to compress`);

							image.status = "error";
						},
						maxWidth:
							controlsValue.maxWidth < 50
								? 50
								: controlsValue.maxWidth,
						maxHeight:
							controlsValue.maxHeight < 50
								? 50
								: controlsValue.maxHeight,
						mimeType:
							controlsValue.type !== "auto"
								? `image/${controlsValue.type}`
								: "auto",
						convertSize: 10000000,
						checkOrientation: true,
						convertTypes: [
							"image/jpeg",
							"image/png",
							"image/webp",

							"image/gif",
							"image/svg+xml",
						],
					});
			});
		}
		setIsFirst(isFirst + 1);
	};
	// images.length >= 1 &&
	// 	!compare.original.file &&
	// 	setCompare({
	// 		original: images[0].original,
	// 		compressed: images[0].compressed,
	// 	});
	useEffect(() => {
		if (images.length >= 1) {
			isFirst === 1 &&
				setCompare({
					original: images[0].original,
					compressed: images[0].compressed,
				});
		}
	}, [images, isFirst]);

	const [userTried, setUserTried] = useState(0);
	const handleImageZip = async () => {
		const zip = new JSZip();
		if (images) {
			zip.file(
				"readMe.html",
				`<div style="max-width:400px;
				height:350px;
				padding:15px;
				margin:15px;
				box-shadow: -1px 0px 9px -1px #b1b1b1bf;
-webkit-box-shadow: -1px 0px 9px -1px #b1b1b1bf;
-moz-box-shadow: -1px 0px 9px -1px #b1b1b1bf;
			   letter-spacing:1px;
				position:absolute; top:50%; left:50%; transform:translate(-50%,-50%)
				">
	  <h1 style="font-weight:bold;">Thank you for using
		<a  target="_blank" href="https://tinify.pro" style="text-decoration : none;color:orange">
		  tinify.pro
		</a>
	  </h1>
	  <p> Image compressor tool by <a  target="_blank" style="text-decoration : none;color:orange" href=" https://blackkspydo.com">Blackkspydo</a></p> <br>
	  Contact me for any questions or suggestions or if you want to contribute to this project <br><br>
	  Telegram: <a  target="_blank" style="text-decoration : none;color:orange" href=" https://t.me/Blackkspydo">@Blackkspydo</a> <br>
	  Github: <a  target="_blank" target="_blank"  style="text-decoration : none;color:orange" href="https://github.com/blackkspydo"> https://github.com/blackkspydo </a> <br>
	  Telegram channel: <a target="_blank"  style="text-decoration : none;color:orange" href="https://t.me/codenewbie"  >@codeNewbie</a> <br>
	
	</div>`
			);
			zip.folder("images");
			await images.forEach((image) => {
				zip.file(
					`images/${image.compressed.name}`,
					image.compressed.file,
					{
						binary: true,
					}
				);
			});

			zip.generateAsync({ type: "blob" }).then((content) => {
				saveAs(
					content,
					`tinify.pro-${new Date().toISOString().slice(0, 10)}.zip`
				);
			});
		}
		ANALYTICS_zipDownload();
		setUserTried((state) => state + 1);
	};

	useEffect(() => {
		if (blobs.length > 0) {
			handleImageCompression().then(() => {
				toast.success("Images compressed successfully");
			});
		}
		// eslint-disable-next-line
	}, [blobs]);

	useEffect(() => {
		if (blobs.length > 0) {
			setImages([]);
			setBlobs((state) => {
				return state.map((image) => {
					image.status = "pending";
					return image;
				});
			});

			// setTimeout(() => {
			// 	handleImageCompression().then(() => {
			// 		const filtered = images.filter(
			// 			(img) => img.original.name === compare.original.name
			// 		);
			// 		setCompare({
			// 			original: filtered[0].original,
			// 			compressed: filtered[0].compressed,
			// 		});

			// 	});
			// }, 1000);
		}
		// eslint-disable-next-line
	}, [controlsValue]);

	// eslint-disable-next-line
	useEffect(() => {
		window.innerWidth < 980 && window.innerWidth > 500 && setIsTablet(true);
		window.innerWidth > 980 && setIsTablet(false);
		window.innerWidth < 500 && setIsMobile(true) && setIsTablet(false);
		window.innerWidth > 500 && setIsMobile(false);
	});
	// console.log(isTablet);
	useEffect(() => {
		const timer = setTimeout(() => {
			setControlsValue(controls);
		}, 300);
		return () => clearTimeout(timer);
	}, [controls]);

	useEffect(() => {
		if (images.length > 0) {
			const filtered = images.filter(
				(img) => img.original.name === compare.original.name
			);
			filtered.length > 0 &&
				setCompare({
					original: filtered[0].original,
					compressed: filtered[0].compressed,
				});
		}
		// eslint-disable-next-line
	}, [images]);

	const imgHTML = images.map((image, index) => {
		return (
			<div className={styles.compressed} key={image.compressed.url}>
				<div
					className={styles.compressed__image}
					onClick={() => {
						setCompare(image);
					}}>
					<img
						src={image.compressed.url}
						alt={image.compressed.name}
					/>
				</div>
				<button
					className={styles.close_button}
					onClick={() => {
						toast.error("Deleted");
						// images.length > 1
						// 	? index > 1
						// 		? compare.original.name === image.original.name && setCompare(images[index - 1])
						// 		: compare.original.name === image.original.name && setCompare(images[index + 1])
						// : setCompare({
						// 		original: {
						// 			file: null,
						// 			name: "",
						// 			url: "https://picsum.photos/seed/picsum/800/800",
						// 			size: 0,
						// 		},
						// 		compressed: {
						// 			file: null,
						// 			name: "",
						// 			url: "https://picsum.photos/seed/picsum/800/800",
						// 			size: 0,
						// 		},
						//   });

						if (images.length > 1) {
							if (index > 0) {
								compare.original.name === image.original.name &&
									setCompare(images[index - 1]);
							} else {
								compare.original.name === image.original.name &&
									setCompare(images[index + 1]);
							}
						} else {
							setCompare({
								original: {
									file: null,
									name: "",
									url: compareImg,
									size: 0,
								},
								compressed: {
									file: null,
									name: "",
									url: compareImg,
									size: 0,
								},
							});
						}

						setImages((prevState: ImagesInterface[]) =>
							prevState.length > 1
								? prevState.filter(
										(img) =>
											img.compressed.url !==
											image.compressed.url
								  )
								: []
						);
						setBlobs((state) =>
							state.filter(
								(img) => img.file !== image.original.file
							)
						);
					}}>
					<RiDeleteBinLine />
				</button>
			</div>
		);
	});

	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
	const [isSupported, setIsSupported] = useState<boolean>(false);
	useEffect(() => {
		window.addEventListener("beforeinstallprompt", (e) => {
			// Prevent Chrome 67 and earlier from automatically showing the prompt
			e.preventDefault();
			// Stash the event so it can be triggered later.
			setDeferredPrompt(e);
			setIsSupported(true);
		});
		return () => {
			window.removeEventListener("beforeinstallprompt", (e) => {
				e.preventDefault();
				setDeferredPrompt(e);
				setIsSupported(false);
			});
		};
	}, []);
	// const installRef = useRef<HTMLButtonElement>(null);
	const handleInstallButton = async () => {
		deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
		const { outcome } = await deferredPrompt.userChoice;
		// Optionally, send analytics event with outcome of user choice
		console.log(`User response to the install prompt: ${outcome}`);
		// We've used the prompt, and can't use it again, throw it away
		setDeferredPrompt(null);
	};
	const handleInstall = () => {
		setTimeout(() => {
			isSupported &&
				toast(
					(t) => (
						<InstallBanner
							t={t}
							handleInstallButton={handleInstallButton}
						/>
					),
					{
						position: isMobile ? "bottom-center" : "bottom-right",
						duration: Infinity,
					}
				);
		}, 10000);
	};
	useEffect(() => {
		userTried === 1 && handleInstall();
		// eslint-disable-next-line
	}, [userTried]);

	return (
		<Layout>
			<Toaster
				position="bottom-right"
				toastOptions={{
					duration: 1000,
				}}
			/>
			<div className={styles.headerContainer}>
				<div
					id="drop_zone"
					onDrop={async function (e) {
						e.preventDefault();
						e.stopPropagation();
						const files = await Array.from(e.dataTransfer.files);
						const fileObj = files.map((file) => {
							return {
								file: file,
								name: file.name,
								url: URL.createObjectURL(file),
								size: file.size,
								status: "pending",
							};
						});

						setBlobs((state: any) => [...state, ...fileObj]);
						setIsHovering(false);
						ANALYTICS_importedImage();
					}}
					onDragOver={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsHovering(true);
					}}
					onDragEnter={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsHovering(true);
					}}
					onDragLeave={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsHovering(false);
					}}
					onClick={() => {
						fileInputRef.current!.click();
					}}
					style={{
						border: "4px dashed rgba(200, 200, 200, 0.54)",
						padding: "55px 35px",

						textAlign: "center",
						fontSize: "15px",
						cursor: "pointer",
						backgroundColor: isHovering ? "#eee" : "#fff",
						maxWidth: "600px",
						maxHeight: "200px",
						margin: "5rem 10px",
						marginTop: "8rem",
						color: "#777",
					}}>
					<p
						style={{
							pointerEvents: "none",
						}}>
						Drag one or more files to this Drop Zone or Click here
						to select files
					</p>
					<input
						hidden
						ref={fileInputRef}
						multiple
						type="file"
						accept="image/png, image/jpeg, image/webp, image/bmp, image/gif, image/svg+xml"
						onChange={(e: any) => {
							ANALYTICS_importedImage();
							const files = Array.from(e.target.files);

							const fileObj = files.map((file: any) => {
								return {
									file: file,
									name: file.name,
									url: URL.createObjectURL(file),
									size: file.size,
									status: "pending",
								};
							});
							setBlobs((state: any) => [...state, ...fileObj]);
						}}
					/>
				</div>
			</div>

			<div className={styles.imagePreviewContainer}>
				<div className={styles.thumbnailsContainer}>
					<div>
						<h3>Image Thumbnails</h3>
						<AnimatePresence>
							<motion.div
								layout
								className={styles.thumbnails}
								style={{
									justifyContent:
										images.length === 1
											? "flex-start"
											: "space-around",
								}}>
								{images.length ? (
									imgHTML
								) : (
									<p
										style={{
											gridColumn: "1/3",
										}}>
										No images imported
									</p>
								)}
							</motion.div>
						</AnimatePresence>
					</div>
					<div className={styles.ToolsContainer}>
						<h3>Tools</h3>
						<form>
							<div className={styles.formGroup}>
								<label
									className={styles.bold}
									htmlFor="quality">
									Quality:
								</label>
								<input
									type="number"
									id="quality"
									name="quality"
									value={controls.quality}
									onChange={(e) => {
										setControls({
											...controls,
											quality: Number(e.target.value),
										});
									}}
									min={0.1}
									max={1}
									step={0.1}
								/>
							</div>
							<div className={styles.formGroup}>
								<label
									className={styles.bold}
									htmlFor="maxWidth">
									Max Width:
								</label>
								<input
									className={styles.textlike}
									type="number"
									id="maxWidth"
									name="maxWidth"
									value={controls.maxWidth}
									onChange={(e) => {
										setControls({
											...controls,
											maxWidth: Number(e.target.value),
										});
									}}
									min={50}
									max={10000}
									step={50}
								/>

								<div className={styles.px}>px</div>
							</div>
							<div className={styles.formGroup}>
								<label
									className={styles.bold}
									htmlFor="maxHeight">
									Max Height:
								</label>
								<input
									className={styles.textlike}
									type="number"
									id="maxHeight"
									name="maxHeight"
									value={controls.maxHeight}
									onChange={(e) => {
										setControls({
											...controls,
											maxHeight: Number(e.target.value),
										});
									}}
									min={50}
									step={50}
									max={10000}
								/>
								<div className={styles.px}>px</div>
							</div>
							<div className={styles.formGroup}>
								<label className={styles.bold} htmlFor="type">
									File type:
								</label>
								<select
									className={styles.select}
									id="type"
									name="type"
									value={controls.type}
									onChange={(e) => {
										setControls({
											...controls,
											type: e.target.value,
										});
									}}>
									<option value="auto">auto</option>
									<option value="jpeg">jpeg</option>
									<option value="png">png</option>
									<option value="webp">webp</option>
									<option value="gif">gif</option>
									<option value="svg+xml">svg+xml</option>
								</select>

								<span
									style={{
										fontSize: "0.8em",
										color: "gray",
										display: "block",
									}}>
									(Leave untouched for default file type)
								</span>
							</div>
						</form>
					</div>
				</div>
				<div className={styles.imagePreview}>
					<h3>Image Preview</h3>
					{!compare.compressed.file && (
						<span className={styles.imagePreview__small}>
							Click on the thumbnail to view on the canvas
						</span>
					)}
					<div className={styles.imagePreview__container}>
						<ComparisonSlider
							defaultValue={50}
							itemTwo={
								<div className={styles.afterContainer}>
									<img
										src={compare.compressed.url}
										alt={compare.compressed.name}
										height="100%"
										width="100%"
									/>
									<div className={styles.imageInfo}>
										after
									</div>
								</div>
							}
							itemOne={
								<div className={styles.beforeContainer}>
									<img
										src={compare.original.url}
										alt={compare.original.name}
										height="100%"
										width="100%"
									/>
									<div className={styles.imageInfo}>
										before
									</div>
								</div>
							}
							handleAfter={
								<div
									className={styles.handleAfter}
									style={{
										width: "2px",
										height: "100%",
										backgroundColor: "#eee",
									}}></div>
							}
							handleBefore={
								<div
									className={styles.handleBefore}
									style={{
										width: "2px",
										height: "100%",
										backgroundColor: "#eee",
									}}></div>
							}
							aspectRatio={isTablet ? 4 / 3 : 1 / 1}
							orientation="horizontal"
						/>
					</div>
				</div>
				<div className={styles.imageInfoContainer}>
					<div className={styles.imageDetailsHeader}>
						<h3>Image Details</h3>
						{compare.original.file ? (
							<>
								<div
									className={`${styles.imageInfo} ${styles.imageInfo__original}`}>
									<h4>Original Image</h4>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											Time Stamp:
										</span>{" "}
										<span className={styles.info}>
											{new Date(
												compare.original.file.lastModified
											).toLocaleTimeString("en-US", {
												hour12: false,
												hour: "2-digit",
												minute: "2-digit",
												second: "2-digit",
											})}
										</span>
									</div>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											LastModified:
										</span>{" "}
										<span className={styles.info}>
											{new Date(
												compare.original.file.lastModified
											).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
												weekday: "short",
											})}
										</span>
									</div>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											Name:
										</span>{" "}
										<span className={styles.info}>
											{nameShorter(compare.original.file)}
										</span>
									</div>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											Type:
										</span>{" "}
										{compare.original.file.type}
									</div>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											Size:
										</span>{" "}
										{(
											Number(compare.original.size) / 1000
										).toFixed(2)}
										kb
									</div>
								</div>
								<div
									className={`${styles.imageInfo} ${styles.imageInfo__compressed}`}>
									<h4>Compressed Image</h4>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											Time Stamp:
										</span>{" "}
										<span className={styles.info}>
											{new Date(
												compare.compressed.file.lastModified
											).toLocaleTimeString("en-US", {
												hour12: false,
												hour: "2-digit",
												minute: "2-digit",
												second: "2-digit",
											})}
										</span>
									</div>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											LastModified:
										</span>{" "}
										<span className={styles.info}>
											{new Date(
												compare.compressed.file.lastModified
											).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
												weekday: "short",
											})}
										</span>
									</div>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											Name:
										</span>{" "}
										<span className={styles.info}>
											{nameShorter(
												compare.compressed.file
											)}
										</span>
									</div>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											Type:
										</span>{" "}
										{compare.compressed.file.type}
									</div>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											Size:
										</span>{" "}
										{(
											Number(compare.compressed.size) /
											1000
										).toFixed(2)}
										kb (
										{(
											100 -
											(Number(compare.compressed.size) /
												Number(compare.original.size)) *
												100
										).toFixed(2)}
										% Off)
									</div>
								</div>
								<div
									className={`${styles.imageInfo} ${styles.imageInfo__compressed}`}>
									<h4>Total Compression result</h4>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											Time Stamp:
										</span>{" "}
										<span className={styles.info}>
											{new Date(
												compare.compressed.file.lastModified
											).toLocaleTimeString("en-US", {
												hour12: false,
												hour: "2-digit",
												minute: "2-digit",
												second: "2-digit",
											})}
										</span>
									</div>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											LastModified:
										</span>{" "}
										<span className={styles.info}>
											{new Date(
												compare.compressed.file.lastModified
											).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
												weekday: "short",
											})}
										</span>
									</div>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											Original Filesize:
										</span>{" "}
										<span className={styles.info}>
											{(
												images.reduce((total, img) => {
													return (
														total +
														Number(
															img.original.file
																.size
														)
													);
												}, 0) / 1000000
											).toFixed(2)}
											{"mb"}
										</span>
									</div>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											Final Filesize:
										</span>{" "}
										<span className={styles.info}>
											{(
												images.reduce((total, img) => {
													return (
														total +
														Number(
															img.compressed.file
																.size
														)
													);
												}, 0) / 1000000
											).toFixed(2)}
											{"mb"}
										</span>
									</div>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											File Types:
										</span>{" "}
										{Array.from(
											new Set(
												images.map((img) => {
													return img.original.file.type.split(
														"/"
													)[1];
												})
											)
										).join(", ")}
									</div>
									<div className={styles.infoItem}>
										<span className={styles.bold}>
											Reduced By
										</span>{" "}
										{(
											100 -
											images.reduce((total, img) => {
												return (
													total +
													Number(
														img.compressed.file.size
													)
												);
											}, 0) /
												10000 /
												(images.reduce((total, img) => {
													return (
														total +
														Number(
															img.original.file
																.size
														)
													);
												}, 0) /
													1000000)
										).toFixed(2)}
										% of original filesize
									</div>
								</div>
								<div className={styles.downloadContainer}>
									<div className={styles.download}>
										<a
											target="_blank"
											rel="noreferrer"
											href={compare.compressed.url}
											download={
												compare.compressed.file.name
											}
											onClick={() => {
												ANALYTICS_singleDownload();
											}}>
											<button
												className={
													styles.downloadButton
												}
												onClick={() => {
													setUserTried(
														(state) => state + 1
													);
												}}>
												Download Current
											</button>
										</a>
									</div>
									<div className={styles.download}>
										<button
											onClick={handleImageZip}
											className={styles.downloadButton}>
											Download All
										</button>
									</div>
								</div>
							</>
						) : (
							<p>No image Selected</p>
						)}
					</div>
				</div>
			</div>
			<div className={styles.howToContainer}>
				<div className={styles.howTo}>
					<h2>How To Use</h2>
					<p>
						Select an image from your computer or upload one from
						your computer.
					</p>
					<p>
						The image will be compressed and compressed files will
						be downloaded.
					</p>
					<p>
						The compressed files will be downloaded as a zip file.
					</p>
				</div>
			</div>
		</Layout>
	);
}

export default ImageCompressor;
