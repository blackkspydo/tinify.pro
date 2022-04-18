import styles from "./InstallBanner.module.scss";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
const InstallBanner = ({ handleInstallButton, t }: any) => {
	return (
		<div className={styles.toast}>
			<p>
				Install our app on your Device! <br />
				It won't take space! Works Offline!
			</p>
			<motion.button
				transition={{
					duration: 0.3,
					ease: "easeInOut",
				}}
				whileHover={{ scale: 1.01 }}
				whileTap={{ scale: 0.96 }}
				animate={{ opacity: 1, scale: 1 }}
				className={styles.install_button}
				onClick={() => {
					toast.dismiss(t.id);
					handleInstallButton();
				}}>
				install
			</motion.button>
			<div
				className={styles.closeButton}
				onClick={() => {
					toast.dismiss(t.id);
				}}>
				<MdClose />
			</div>
		</div>
	);
};

export default InstallBanner;
