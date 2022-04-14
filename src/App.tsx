import { useState, useRef, useEffect } from "react";
import Compressor from "compressorjs";

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
	const [isHovering, setIsHovering] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	console.log(blobs);
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
			<div className={styles.imageContainer}>
				<div className={styles.compressed}>
					<div>compressed</div>
					<img
						src={image.compressed.url}
						alt={image.compressed.name}
					/>
					<div className={styles.imageInfo}>
						<div className={styles.imageName}>
							{image.compressed.name}
						</div>
						<div className={styles.imageSize}>
							{Number(image.compressed.size) / 1000}kb
						</div>
					</div>
				</div>
				<div className={styles.original}>
					<div>original</div>
					<img src={image.original.url} alt={image.original.name} />
					<div className={styles.imageInfo}>
						<div className={styles.imageName}>
							{image.original.name}
						</div>
						<div className={styles.imageSize}>
							{Number(image.original.size) / 1000}kb
						</div>
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
		</div>
	);
}

export default App;
