import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./SlidingMenu.module.css";
import ColorChange from "./ColorChange.js";

const SlidingMenu = props => {
    const { isOpen, children, onChange } = props;

    const onClickHandler = () => {
        onChange(!isOpen);
        console.log(isOpen);
    }

    function changeColor(color) {
        document.body.style.backgroundColor = color;
    }

    return (
        <div className="wrapper">
            <div
                onClick={onClickHandler}
                className={cx(styles.hamburger, { [styles.active]: !isOpen })}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div className={cx(styles.menu, { [styles.active]: !isOpen })}>
                {children}
                <div id="menu-inner">
                    <h2>About Rabbit Hole</h2>
                    <p>Rabbit Hole was created for those who want to go down a "rabbit hole"
                        of information based on a selected topic. We curate information based
                        on your search term, then provide you with the ability to explore
                        related topics.
                    </p>
                    <p>
                        Creators: Brendan Berkman and Kevin King
                    </p>
                    <p>
                        Dartmouth College Class of 2024
                    </p>
                    {/* <h3>Change Color Theme: </h3>
                    <div className='color-container'>
                        <ColorChange colorType={'green'} onClick = {changeColor(`{colorType}`)}/>
                    </div> */}

                </div>
            </div>

        </div>
    );
};

SlidingMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    children: PropTypes.node,
    onChange: PropTypes.func.isRequired
  };
  
SlidingMenu.defaultProps = {
    isOpen: false
  };
  
  export default SlidingMenu;