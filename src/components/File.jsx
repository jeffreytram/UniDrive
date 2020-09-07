import React from 'react';
import './File.css'

/* Props contains: Name, Link, Image */
export default function File(props) {
    return (
        <a href={props.data.webViewLink}>
            <div className="FileContainer">
                <img className="FileImg" src={props.data.iconLink} />
                <div className="FileName">{props.data.name}</div>
            </div>
        </a>
    )
}