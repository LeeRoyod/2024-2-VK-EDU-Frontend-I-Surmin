import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '@mui/material';

export const LazyLoadAvatar = ({ src, alt, children, ...props }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const avatarRef = useRef(null);

  useEffect(() => {
    let observer;
    if (avatarRef.current) {
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
        threshold: 0.01
      });

      observer.observe(avatarRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div ref={avatarRef} style={{ display: 'inline-block' }}>
      <Avatar src={shouldLoad ? src : ''} alt={alt} {...props}>
        {!shouldLoad && children}
        {shouldLoad && !src && children}
      </Avatar>
    </div>
  );
};

LazyLoadAvatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  children: PropTypes.node
};
