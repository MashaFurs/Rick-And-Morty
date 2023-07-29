import React, { useState } from "react";

const ButtonUp = ()=>{

    const[isVisible, setIsVisible]=useState(false);

    const toggleVisibility = () =>{

        if(window.pageYOffset > 300 ) {
            setIsVisible(true); 
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop =()=>{
        window.scrollTo({
            top:0,
            behavior: 'smooth'
        });
    };

    window.addEventListener('scroll', toggleVisibility);
    

    return(
        <button  className={`scroll_top ${isVisible ? 'visible' : 'hidden'}`} onClick={scrollToTop}>TO TOP</button>
    )
};

export default ButtonUp;