import React from 'react';
import Lottie from 'lottie-react';

import loadingAnimation from '../../images/loading-animation.json';
import './loading.scss';

const Loading = () => {
    return (
        <div className='loading'>
            <Lottie
                animationData={loadingAnimation}
                loop={true}
                style={{
                    maxWidth: '300px',
                    maxHeight: '300px',
                    width: '100%',
                    height: '100%',
                }}
                autoplay={true}
            />
        </div>
    );
};

export default Loading;
