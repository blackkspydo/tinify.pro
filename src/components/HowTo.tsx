import styles from "./HowTo.module.scss";
import index_bg from "../static/index_bg.svg";
import img_1 from "../static/imgs/image-1.jpg";
import img_2 from "../static/imgs/image-2.jpg";
import img_3 from "../static/imgs/image-3.jpg";
import img_4 from "../static/imgs/image-4.jpg";
import img_5 from "../static/imgs/image-5.jpg";

const HowTo = () => {
	return (
		<div className={styles.container}>
			<div className={styles.howto__item}>
				<div className={styles.text}>
					<div className={styles.index}>
						<span>1</span>
						<img src={index_bg} alt="1" />
					</div>
					<div className={styles.howto__item__content}>
						Select Image/images from your device by dropping or
						clicking this area
					</div>
				</div>
				<div className={styles.howto__item__img}>
					<img src={img_1} alt="1" />
				</div>
			</div>
			<div className={styles.howto__item}>
				<div className={styles.text}>
					<div className={styles.index}>
						<span>2</span>
						<img src={index_bg} alt="1" />
					</div>
					<div className={styles.howto__item__content}>
						When you import your images you’ll see thumbnails as
						shown below
					</div>
				</div>
				<div className={styles.howto__item__img}>
					<img src={img_2} alt="2" />
				</div>
			</div>
			<div className={styles.howto__item}>
				<div className={styles.text}>
					<div className={styles.index}>
						<span>3</span>
						<img src={index_bg} alt="1" />
					</div>
					<div className={styles.howto__item__content}>
						Click on any image to open the interface, or delete if
						you wish to Your interface should look something like
						this
					</div>
				</div>
				<div className={styles.howto__item__img}>
					<img src={img_3} alt="3" />
				</div>
			</div>
			<div className={styles.howto__item}>
				<div className={styles.text}>
					<div className={styles.index}>
						<span>4</span>
						<img src={index_bg} alt="4" />
					</div>
					<div className={styles.howto__item__content}>
						Default settings is good enough for most of the use case
						But, if you’re feeling adventurous then you may play
						with different settings
					</div>
				</div>

				<div className={styles.flex}>
					<div className={styles.howto__item__img}>
						<img src={img_4} alt="4" />
					</div>
					<div className={styles.tools}>
						<div className={styles.tools__item}>
							<div className={styles.tools__item__title}>
								Quality:
							</div>
							<div className={styles.tools__item__content}>
								Selects different compression ratios 0.6-0.8 is
								the recommended settings
							</div>
						</div>
						<div className={styles.tools__item}>
							<div className={styles.tools__item__title}>
								Max-width:
							</div>
							<div className={styles.tools__item__content}>
								This setting is to resize images to certain
								width{" "}
							</div>
						</div>
						<div className={styles.tools__item}>
							<div className={styles.tools__item__title}>
								Max-height:
							</div>
							<div className={styles.tools__item__content}>
								This setting is to resize images to certain
								height{" "}
							</div>
						</div>
						<div className={styles.tools__item}>
							<div className={styles.tools__item__title}>
								File Type:
							</div>
							<div className={styles.tools__item__content}>
								You can convert to certain supported file type
								conversion{" "}
								<span>
									{" "}
									(This is experimental feature, doesnot
									guarantee 100%)
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.howto__item}>
				<div className={styles.text}>
					<div className={styles.index}>
						<span>5</span>
						<img src={index_bg} alt="5" />
					</div>

					<div className={styles.howto__item__content}>
						After you’re happy with your conversions, You may
						proceed to download your compressed files. You have two
						options:
					</div>
				</div>
				<div className={styles.flex}>
					<div className={styles.options}>
						<ol>
							<li>Download Single file</li>
							<li>Download zipped up files</li>
						</ol>
					</div>

					<div className={styles.howto__item__img}>
						<img src={img_5} alt="5" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default HowTo;
