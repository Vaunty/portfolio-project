import React from "react";
import ParallaxTilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

// Import your profile picture
// Adjust the path according to your file structure
import profilePic from "../assets/ngoy.jpg"; // Change to your image file name and extension

// Assuming you have a LinkedIn icon in your assets folder
import { linkedin } from "../assets";

const ServiceCard = ({ index, title, icon }) => (
  <ParallaxTilt className='xs:w-[250px] w-full' tiltMaxAngleX={45} tiltMaxAngleY={45} scale={1} transitionSpeed={450}>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'>
        <img
          src={icon}
          alt='web-development'
          className='w-16 h-16 object-contain'
        />
        <h3 className='text-white text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </motion.div>
  </ParallaxTilt>
);

const About = () => {
  // Add your LinkedIn profile URL here
  const linkedinProfileLink = "https://www.linkedin.com/in/matthewngoy/";
  
  return (
    <>
      <div className="flex flex-col md:flex-row items-start justify-between">
        <div className="md:flex-1">
          <motion.div variants={textVariant()}>
            <p className={styles.sectionSubText}>Introduction</p>
            <h2 className={styles.sectionHeadText}>Overview.</h2>
          </motion.div>

          <motion.p
            variants={fadeIn("", "", 0.1, 1)}
            className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
          >
            I'm a skilled software developer with experience in Python and
            JavaScript, and currently learning frameworks such as React, Node.js, and
            Three.js. I'm a quick learner and collaborate closely with clients to
            create efficient, scalable, and user-friendly solutions that solve
            real-world problems. Let's work together to bring your ideas to life!
            <span 
              onClick={() => window.open(linkedinProfileLink, "_blank")}
              className='inline-flex items-center ml-2 cursor-pointer'
            >
              <img 
                src={linkedin} 
                alt='LinkedIn Profile' 
                className='w-6 h-6 object-contain hover:opacity-80 transition-opacity'
              />
            </span>
          </motion.p>
        </div>
        
        {/* Profile Image Section */}
        <motion.div 
          variants={fadeIn("left", "spring", 0.5, 0.75)}
          className="md:flex-1 flex justify-center mt-10 md:mt-0"
        >
          <div className="rounded-full border-4 border-secondary w-64 h-64 overflow-hidden">
            <img 
              src={profilePic} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      <div className='mt-20 flex flex-wrap gap-10'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");