import { useState, useRef, useEffect, useMemo } from "react";
import Compressor from "compressorjs";
import { ComparisonSlider } from "react-comparison-slider";
import styles from "./App.module.scss";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import { saveAs } from "file-saver";
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
function App() {
	const [images, setImages] = useState<ImagesInterface[]>([]);
	const [blobs, setBlobs] = useState<BlobObjInterface[]>([]);
	const [compare, setCompare] = useState<any>({
		original: {
			file: null,
			name: "",
			url: "https://picsum.photos/seed/picsum/800/800",
			size: 0,
		},
		compressed: {
			file: null,
			name: "",
			url: "https://picsum.photos/seed/picsum/800/800",
			size: 0,
		},
	});
	const [controls, setControls] = useState<any>({
		maxWidth: 1200,
		maxHeight: 1200,
		quality: 0.8,
		minSize: 200,
	});
	const [controlsValue, setControlsValue] = useState<any>({
		maxWidth: 800,
		maxHeight: 800,
		quality: 0.8,
		minSize: 200,
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
			await blobs.forEach((image) => {
				image.status === "pending" &&
					new Compressor(image.file, {
						quality:
							controlsValue.quality > 1
								? 1
								: controlsValue.quality < 0.1
								? 0.1
								: controlsValue.quality,
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
							if (image.file.type === "image/tiff") {
								toast.error("TIFF files are not supported");
							}
							
							
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
						mimeType: "image/jpeg" || "image/png",
						convertSize:
							controlsValue.minSize < 10
								? 10
								: controlsValue.minSize * 1000,
						checkOrientation: true,
						convertTypes: [
							"image/jpeg",
							"image/png",
							"image/webp",
							"image/bmp",
							"image/gif",
							"image/svg+xml",
						],
					});
			});
		}
	};

	const handleImageZip = async () => {
		const zip = new JSZip();
		if (images) {
			zip.file(
				"readMe.txt",
				`Thank you for using this tool.
Image compressor tool by Blackkspydo 
Code will be opensourced soon in github
Contact me for any questions or suggestions or if you want to contribute to this project 
telegram: https://t.me/blackkspydo 
telegram channel: https://t.me/codenewbie 
github: https://github.com/blackkspydo`
			);
			await images.forEach((image) => {
				zip.file(image.compressed.name, image.compressed.file);
			});
			zip.generateAsync({ type: "blob" }).then((content) => {
				saveAs(content, "Compressedimages.zip");
			});
		}
	};

	useEffect(() => {
		if (blobs.length > 0) {
			handleImageCompression().then(() => {
				toast.success("Images compressed successfully");
			});
		}
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
	}, [controlsValue]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setControlsValue(controls);
		}, 200);
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
	}, [images]);
	
	
	const imgHTML = useMemo(() => {
		return images.map((image, index) => {
			return (
				<div className={styles.compressed} key={image.compressed.url}>
					<img
						onClick={() => {
							setCompare(image);
							
						}}
						src={image.compressed.url}
						alt={image.compressed.name}
					/>
					<button
						className={styles.close_button}
						onClick={() => {
							toast.error("Deleted");
							setImages((prevState: ImagesInterface[]) =>
								prevState.length > 1
									? prevState.filter(
											(img) =>
												img.compressed.url !==
												image.compressed.url
									  )
									: []
							);
							images.length > 1
								? index > 1
									? compare === image &&
									  setCompare(images[index - 1])
									: setCompare(images[index + 1])
								: setCompare({
										original: {
											file: null,
											name: "",
											url: "https://picsum.photos/seed/picsum/800/800",
											size: 0,
										},
										compressed: {
											file: null,
											name: "",
											url: "https://picsum.photos/seed/picsum/800/800",
											size: 0,
										},
								  });
						}}>
						X
					</button>
				</div>
			);
		});
	}, [images]);

	return (
		<div className="App">
			<Toaster
				position="bottom-right"
				toastOptions={{
					duration: 1000,
				}}
			/>
			<h1>Image compressor</h1>
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
					border: "3px dashed #bbb",
					padding: "30px",
					textAlign: "center",
					fontSize: "16px",
					cursor: "pointer",
					backgroundColor: isHovering ? "#eee" : "#fff",
					maxWidth: "600px",
					maxHeight: "500px",
					margin: "20px auto",
				}}>
				<p
					style={{
						pointerEvents: "none",
					}}>
					Drag one or more files to this Drop Zone or Click here to
					select files
				</p>
				<input
					hidden
					ref={fileInputRef}
					multiple
					type="file"
					accept="image/png, image/jpeg, image/webp, image/bmp, image/gif, image/svg+xml"
					onChange={(e: any) => {
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

			<div className={styles.imagePreviewContainer}>
				<div className={styles.thumbnailsContainer}>
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
									min={10}
									max={10000}
								/>
								{" px"}
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
									min={10}
									max={10000}
								/>
								{" px"}
							</div>
							<div className={styles.formGroup}>
								<label
									className={styles.bold}
									htmlFor="minSize">
									Min size:
								</label>
								<input
									className={styles.textlike}
									type="number"
									id="minSize"
									name="minSize"
									value={controls.minSize}
									onChange={(e) => {
										setControls({
											...controls,
											minSize: Number(e.target.value),
										});
									}}
								/>
								{" kb"}
								<span
									style={{
										fontSize: "0.8em",
										color: "gray",
										display: "block",
									}}>
									(To trigger compression)
								</span>
							</div>
						</form>
					</div>
				</div>
				<div className={styles.imagePreview}>
					<h3>Image Preview</h3>
					<ComparisonSlider
						defaultValue={50}
						itemTwo={
							<div className={styles.afterContainer}>
								<img
									src={compare.compressed.url}
									alt={compare.compressed.name}
								/>
								<div className={styles.imageInfo}>after</div>
							</div>
						}
						itemOne={
							<div className={styles.beforeContainer}>
								<img
									src={compare.original.url}
									alt={compare.original.name}
								/>
								<div className={styles.imageInfo}>before</div>
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
						aspectRatio={1 / 1}
						orientation="horizontal"
					/>
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
											{compare.compressed.file.lastModifiedDate.toLocaleDateString(
												"en-US",
												{
													month: "short",
													day: "numeric",
													year: "numeric",
													weekday: "short",
												}
											)}
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
											{compare.compressed.file.lastModifiedDate.toLocaleDateString(
												"en-US",
												{
													month: "short",
													day: "numeric",
													year: "numeric",
													weekday: "short",
												}
											)}
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
										<button
											className={styles.downloadButton}>
											<a
												target="_blank"
												rel="noreferrer"
												href={compare.compressed.url}
												download={
													compare.compressed.file.name
												}>
												Download Current
											</a>
										</button>
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
		</div>
	);
}

export default App;
