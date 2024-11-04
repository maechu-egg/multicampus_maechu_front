import React from 'react';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-container">
      {/* 로고 섹션 */}
      <section className="logo-section">
        <img 
          src={process.env.PUBLIC_URL + '/img/mainlogo.png'} 
          alt="Workspace Logo" 
          className="main-logo"
        />
      </section>

      {/* WHY 섹션 */}
      <section className="info-section">
        <div className="info-content">
          <div className="info-label">WHY</div>
          <div className="info-text">
            우리는 ~~~ 이유로 이 서비스를 만들게 되었습니다.<br />
            자기 자신을 사랑하고 가꾸며 성장을 추구하는<br />
            모든 운동인들 위한<br />
            중심이 되는 workspace.
          </div>
        </div>
      </section>

      {/* we are 섹션들 */}
      <section className="info-section">
        <div className="info-content">
          <div className="info-label">we are</div>
          <div className="info-text">
            우리는 ~~~ 이유로 이 서비스를 만들게 되었습니다.<br />
            자기 자신을 사랑하고 가꾸며 성장을 추구하는<br />
            모든 운동인들 위한<br />
            중심이 되는 workspace.
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-content">
          <div className="info-label">we are</div>
          <div className="info-text">
            우리는 ~~~ 이유로 이 서비스를 만들게 되었습니다.<br />
            자기 자신을 사랑하고 가꾸며 성장을 추구하는<br />
            모든 운동인들 위한<br />
            중심이 되는 workspace.
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;