import React from "react";
import styled from "styled-components";

interface ProfileModalProps {
    isProfileOpen: boolean; 
    onProfileClose: () => void;
    profileImage: string; 
    nickname: string; 
    personalBadge: string; 
    crewBadge: string; 
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index:1000000;
`;

const Modal = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #555;

  &:hover {
    color: #000;
  }
`;

const ProfileImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 10px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Nickname = styled.h2`
 font-size: 1.2rem;
 font-weight: bold;
 margin-bottom: 15px;
 overflow: hidden;
 text-overflow: ellipsis;
 white-space: nowrap;
 max-width: 250px;
 margin: 0 auto 15px;
`;

const BadgeContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
`;

const Badge = styled.div`
  text-align: center;

  img {
    width: 50px;
    height: 50px;
    margin-bottom: 5px;
  }

  p {
    font-size: 0.9rem;
  }
`;

const ConfirmButton = styled.button`
  background-color: #b6c0d3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #303d55;
  }
`;

const ProfileModal: React.FC<ProfileModalProps> = ({
  isProfileOpen,
  onProfileClose,
  profileImage,
  nickname,
  personalBadge,
  crewBadge,
}) => {
  if (!isProfileOpen) {
    return null;
  }



  return (
    <Overlay onClick={onProfileClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onProfileClose}>&times;</CloseButton>
        <ProfileImageWrapper>
          <ProfileImage src={profileImage} alt={`${nickname} 프로필 이미지`} />
        </ProfileImageWrapper>
        <Nickname>{nickname}</Nickname>
        <BadgeContainer>
          <Badge>
            <img src={personalBadge} alt="개인 뱃지" />
            <p>개인 뱃지</p>
          </Badge>
          <Badge>
            <img 
              src={crewBadge} 
              alt="크루 뱃지" 
              onError={(e) => {
                e.currentTarget.src = '/img/crewBadge/crewBadgeDefault.png';
              }}
            />
            <p>크루 뱃지</p>
          </Badge>
        </BadgeContainer>
        <ConfirmButton onClick={onProfileClose}>확인</ConfirmButton>
      </Modal>
    </Overlay>
  );
};

export default ProfileModal;
