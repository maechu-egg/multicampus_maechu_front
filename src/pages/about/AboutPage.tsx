import React from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import "./AboutPage.css";

function AboutPage() {
  return (
    <ReactFullpage
      licenseKey={""}
      scrollingSpeed={1000}
      navigation={true}
      credits={{ enabled: true }}
      render={({ state, fullpageApi }) => {
        return (
          <ReactFullpage.Wrapper>
            {/* 로고 섹션 */}
            <div className="section logo-section">
              <img
                src={process.env.PUBLIC_URL + "/img/mainlogo.png"}
                alt="Workspace Logo"
                className="main-logo"
              />
            </div>

            {/* WHY 섹션 */}
            <div className="section">
              <section className="info-section active">
                <div className="info-content">
                  <div className="info-text">
                    <h2>WHY ?</h2>
                    <h3>혼자하는 운동이 지겹지 않으세요?</h3>
                    <p>
                      운동을 시작하고 지속하는 것이 왜 어려울까요?
                      <br />
                      매일 반복되는 운동에 동기부여가 필요하진 않으신가요?
                      <br />
                      나만의 운동 기록을 체계적으로 관리하고 싶지 않으신가요?
                      <br />
                      함께 으쌰으쌰하며 성장할 수 있는 공간,
                      <br />
                      저희가 만들어드리겠습니다.
                    </p>
                  </div>
                  <div className="info-image">
                    <img
                      src={process.env.PUBLIC_URL + "/img/image4.png"}
                      alt="Why Image"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* WHAT 섹션 */}
            <div className="section">
              <section className="info-section active">
                <div className="info-content">
                  <div className="info-image">
                    <img
                      src={process.env.PUBLIC_URL + "/img/image2.png"}
                      alt="What Image"
                    />
                  </div>
                  <div className="info-text">
                    <h2>WHAT ?</h2>
                    <h3>
                      단순한 운동 기록을 넘어선 소셜 피트니스 플랫폼입니다
                    </h3>
                    <p>
                      당신의 완벽한 운동 파트너가 되어드립니다.
                      <br />
                      - 크루와 함께하는 즐거운 운동 챌린지
                      <br />
                      - 1:1 배틀로 즐기는 짜릿한 경쟁
                      <br />
                      - 뱃지와 랭킹으로 느끼는 성취감
                      <br />
                      - 실시간 운동 기록과 식단 관리
                      <br />
                      - 다양한 운동 정보가 공유되는 커뮤니티
                      <br />
                      운동이 더 이상 지루하지 않습니다.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* WHO 섹션 */}
            <div className="section">
              <section className="info-section active">
                <div className="info-content">
                  <div className="info-text">
                    <h2>WHO ?</h2>
                    <h3>운동을 즐기고 싶은 모든 분들을 위해 준비했습니다</h3>
                    <p>
                      이런 분들을 위해 준비했습니다.
                      <br />
                      - 운동을 시작하고 싶지만 방법을 모르는 초보자
                      <br />
                      - 함께 운동할 메이트를 찾고 있는 분<br />
                      - 체계적인 운동/식단 기록을 원하는 분<br />
                      - 다양한 운동 정보를 나누고 싶은 분<br />
                      당신의 건강한 라이프스타일, 우리가 함께합니다.
                    </p>
                  </div>
                  <div className="info-image">
                    <img
                      src={process.env.PUBLIC_URL + "/img/image1.png"}
                      alt="Who Image"
                    />
                  </div>
                </div>
              </section>
            </div>
          </ReactFullpage.Wrapper>
        );
      }}
    />
  );
}

export default AboutPage;
