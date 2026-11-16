import React, { useState } from "react";
import "./style.css";
import { VscGrabber, VscClose } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { logotext ,socialprofils, resume } from "../content_option";
import Themetoggle from "../components/themetoggle";
import LanguageSwitcher from "../components/languageswitcher";
import { useTranslation } from 'react-i18next';

const Headermain = () => {
  const [isActive, setActive] = useState(true);
  const { t } = useTranslation();

  const handleToggle = () => {
    setActive(!isActive);
    document.body.classList.toggle("ovhidden");
  };

  const handleDownloadResume = async (e) => {
    e.preventDefault();
    handleToggle();
    
    // Call backend microservice endpoint (Goal 5: all keys moved to backend)
    const backendResumeUrl = resume || "https://go-seek-backend.onrender.com/api/resume/download";
    
    try {
      const response = await fetch(backendResumeUrl);
      if (!response.ok) throw new Error('Failed to retrieve resume from backend service');
      const blob = await response.blob();
      const filename = 'Yepalagunta_Srikanth_Resume.pdf';
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn('Direct stream fallback:', err);
      window.open(backendResumeUrl, '_blank');
    }
  };

  return (
    <>
      <header className="fixed-top site__header">
        <div className="d-flex align-items-center justify-content-between">
          <Link  className="navbar-brand nav_ac" to="/">
            {logotext}
          </Link>
          <div className="d-flex align-items-center">
          <LanguageSwitcher />
          <Themetoggle />
          <button className="menu__button  nav_ac" onClick={handleToggle}>
            {!isActive ? <VscClose /> : <VscGrabber />}
          </button>
          
          </div>
        </div>

        <div className={`site__navigation ${!isActive ? "menu__opend" : ""}`}>
          <div className="bg__menu h-100">
            <div className="menu__wrapper">
              <div className="menu__container p-3">
                <ul className="the_menu">
                  <li className="menu_item ">
                    <Link onClick={handleToggle} to="/" className="my-3">{t('home')}</Link>
                  </li>
                  <li className="menu_item">
                    <Link onClick={handleToggle} to="/products" className="my-3">{t('products')}</Link>
                  </li>
                  <li className="menu_item">
                    <Link onClick={handleToggle} to="/about" className="my-3">{t('about')}</Link>
                  </li>
                  <li className="menu_item">
                    <Link onClick={handleToggle} to="/contact" className="my-3">{t('contact')}</Link>
                  </li>
                  <li className="menu_item">
                    <a onClick={handleDownloadResume} href={resume} className="my-3">
                      {t('Resume')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="menu_footer d-flex flex-column flex-md-row justify-content-between align-items-md-center position-absolute w-100 p-3">
            <div className="d-flex">
            <a href={socialprofils.facebook}>Facebook</a>
            <a href={socialprofils.github}>Github</a>
            <a href={socialprofils.twitter}>Twitter</a>
            </div>
            <p className="copyright m-0">copyright {logotext}</p>
          </div>
        </div>
      </header>
      <div className="br-top"></div>
      <div className="br-bottom"></div>
      <div className="br-left"></div>
      <div className="br-right"></div>
      
    </>
  );
};

export default Headermain;
