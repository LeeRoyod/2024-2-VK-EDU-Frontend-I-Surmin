import React, { useEffect, useRef, useState } from 'react';

export const LazyLoadImage = ({ src, alt, ...props }) => {
    const [shouldLoad, setShouldLoad] = useState(false);
    const imageRef = useRef(null);

    useEffect(() => {
        let observer;
        if (imageRef.current) {
            observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShouldLoad(true);
                        if (observer) {
                            observer.disconnect();
                        }
                    }
                });
            }, {
                rootMargin: '0px 0px 50px 0px',
                threshold: 0.01,
            });

            observer.observe(imageRef.current);
        }

        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, []);

    return (
        <img
            ref={imageRef}
            src={shouldLoad ? src : ''}
            alt={alt}
            {...props}
        />
    );
};
