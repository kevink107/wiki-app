import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./SlidingMenu.module.css";

const SlidingMenu = props => {
    const { isOpen, children, onChange } = props;

    const onClickHandler = () => {
        onChange(!isOpen);
        console.log(isOpen);
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
                        on the topic of your choice, and give you the ability to explore
                        related topics.
                    </p>
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