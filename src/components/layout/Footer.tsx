import React from 'react';
import './Footer.css';

function Footer() {

    const teamMembers = [
        { name: '강은종', github: 'https://github.com/anfrk-full' },
        { name: '김동현', github: 'https://github.com/ddayhyun' },
        { name: '설효진', github: 'https://github.com/camelliaseolwang' },
        { name: '신유민', github: 'https://github.com/Yuminyumin' },
        { name: '이연주', github: 'https://github.com/leeyeonju02' },
        { name: '이우진', github: 'https://github.com/w00jinLee' },
        { name: '한석훈', github: 'https://github.com/seokhun11' },
    ];

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <p>
                    팀명 : 매추리알 &nbsp;&nbsp;&nbsp; 
                    ■채용연계 풀스택 개발자 부트캠프(스프링&리액트) 25회차  K-디지털
                    </p>
                </div>
                <hr />
                <div className="footer-info">
                    <p className="team-links">
                        {teamMembers.map((member, index) => (
                            <span key={index}>
                                <a
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="team-member-link"
                                >
                                    {member.name}
                                </a>
                                {index < teamMembers.length - 1 && ' | '}
                            </span>
                        ))}
                    </p>
                    <p>© 2024 매추리알. All rights reserved.</p>
                </div>
                <div className="footer-bottom">
                    <div className="footer-logo">
                        <img
                            src="img/Mainlogo.png"
                            alt="Workspace Logo"
                        />
                    </div>
                    <div className="footer-social">
                        <a href="https://github.com/orgs/maechu-egg/repositories" className="social-icon">
                            <img src="img/Home/github.png" alt="GitHub Icon" style={{width:"30px"}} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
