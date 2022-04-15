import styles from "./Header.module.scss";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>
                &copy; {new Date().getFullYear()} - <a href="https://blackkspydo.com">Blackk Spydo</a>
            </p>
        </footer>
    );
};

export default Footer;

