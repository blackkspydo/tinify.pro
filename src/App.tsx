import { useState, useRef, useEffect } from "react";
import Compressor from "compressorjs";
import { ComparisonSlider } from "react-comparison-slider";
import styles from "./App.module.scss";

interface BlobObjInterface {
	file: File | Blob;
	name: string;
	url: string;
	size: number;
}
interface ImagesInterface {
	original: BlobObjInterface;
	compressed: BlobObjInterface;
}
function App() {
	const [images, setImages] = useState<ImagesInterface[]>([]);
	const [blobs, setBlobs] = useState<BlobObjInterface[]>([]);
	const [compare, setCompare] = useState<ImagesInterface | null>(null);
	const [isHovering, setIsHovering] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	console.log(blobs);

	const nameShorter = (name: string) => {
		if (name.length > 20) {
			return name.substring(0, 20) + "...";
		}
		return name;
	};

	const handleImageCompression = async () => {
		if (blobs) {
			blobs.forEach((image) => {
				new Compressor(image.file, {
					quality: 0.5,
					success(result) {
						console.log(result);
						setImages((prevState: ImagesInterface[]) => [
							...prevState,
							{
								original: image,
								compressed: {
									file: result,
									name: image.name,
									url: URL.createObjectURL(result),
									size: result.size,
								},
							},
						]);
					},
					error(err) {
						console.log(err.message);
						console.log("errrrrr");
					},
					maxWidth: 700,
					maxHeight: 700,
					mimeType: "image/jpeg",
					convertSize: 500000,
					checkOrientation: true,
					convertTypes: [
						"image/jpeg",
						"image/png",
						"image/webp",
						"image/bmp",
						"image/gif",
						"image/svg+xml",
						"image/tiff",
					],
				});
			});
		}
	};
	useEffect(() => {
		if (blobs.length > 0) {
			handleImageCompression();
		}
	}, [blobs]);

	const imgHTML = images.map((image) => {
		return (
			<div className={styles.compressed}>
				<img
					onClick={() => {
						setCompare(image);
						console.log("first");
					}}
					src={image.compressed.url}
					alt={image.compressed.name}
				/>
				<div className={styles.imageInfo}>
					<div className={styles.imageName}>
						{nameShorter(image.compressed.name)}
					</div>
					<div className={styles.imageSize}>
						{(Number(image.original.size) / 1000).toFixed(2)}kb
						{" -> "}
						{(Number(image.compressed.size) / 1000).toFixed(2)}
						kb
					</div>
					<div className={styles.sizeReduced}>
						{(
							(Number(image.compressed.size) /
								Number(image.original.size)) *
							100
						).toFixed(2)}
						%
					</div>
				</div>
			</div>
		);
	});

	return (
		<div className="App">
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
					border: "2px dashed #bbb",
					padding: "20px",
					textAlign: "center",
					fontSize: "16px",
					cursor: "pointer",
					backgroundColor: isHovering ? "#eee" : "",
					maxWidth: "500px",
					maxHeight: "500px",
					margin: "20px auto",
				}}>
				<p
					style={{
						pointerEvents: "none",
					}}>
					Drag one or more assetfiles to this Drop Zone or Click here
					to select files
				</p>
				<input
					hidden
					ref={fileInputRef}
					multiple
					type="file"
					accept="image/*"
					onChange={(e: any) => {
						const files = Array.from(e.target.files);
						console.log(files);
						const fileObj = files.map((file: any) => {
							return {
								file: file,
								name: file.name,
								url: URL.createObjectURL(file),
								size: file.size,
							};
						});
						setBlobs((state: any) => [...state, ...fileObj]);
					}}
				/>
			</div>

			<div className={styles.imagesContainer}>{imgHTML}</div>
			{compare && (
				<div className={styles.imagesCompareContainer}>
					{" "}
					<ComparisonSlider
						defaultValue={50}
						itemOne={
							<img
								src={compare.compressed.url}
								alt={compare.compressed.name}
							/>
						}
						itemTwo={
							<img
								src={compare.original.url}
								alt={compare.original.name}
							/>
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
			)}
		</div>
	);
}

export default App;
