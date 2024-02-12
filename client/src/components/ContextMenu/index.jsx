import React from 'react';

import './contextMenu.scss';

const ContextMenu = ({ top, left, removeMessageFn }) => {
    return (
        <div className='context-menu' style={{ top, left }}>
            <ul className='context-menu__list'>
                <li
                    className='context-menu__list-item'
                    onClick={removeMessageFn}
                >
                    Delete
                </li>
            </ul>
        </div>
    );
};

export default ContextMenu;
