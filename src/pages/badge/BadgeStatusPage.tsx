import React, { useState } from 'react';
import PersonalBadgeModal from './PersonalBadgeModal';
import CrewBadgeModal from './CrewBadgeModal';

const BadgeStatusPage = () => {
    const [isPersonalModalOpen, setPersonalModalOpen] = useState(false);
    const [isCrewModalOpen, setCrewModalOpen] = useState(false);

    const openPersonalModal = () => setPersonalModalOpen(true);
    const closePersonalModal = () => setPersonalModalOpen(false);

    const openCrewModal = () => setCrewModalOpen(true);
    const closeCrewModal = () => setCrewModalOpen(false);

    return (
        <div>
            <button className="btn" onClick={openPersonalModal}>개인 뱃지 보기</button>
            <PersonalBadgeModal isOpen={isPersonalModalOpen} onClose={closePersonalModal} />

            <button className="btn" onClick={openCrewModal}>크루 뱃지 보기</button>
            <CrewBadgeModal isOpen={isCrewModalOpen} onClose={closeCrewModal} />
        </div>
    );
};

export default BadgeStatusPage;
