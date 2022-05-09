import "./topbar.css";
import React, {useState} from "react";
import SlidingMenu from './SlidingMenu';

export default function Topbar() {
    const [isOpen,setOpen] = useState(true);

    return (
        <div className="topbar" id="topbar">
            <SlidingMenu isOpen={isOpen} onChange={setOpen} />
            <h1 id = "title">Rabbit Hole</h1>
        </div>
    )
}