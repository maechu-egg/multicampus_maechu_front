import { useEffect, useState } from "react";
const BASE_URL = "https://workspace.kr.object.ncloudstorage.com/"; // 서버의 기본 URL

interface Feed {
    feed_exTime: number;
    feed_img: string;
    feed_kcal: number;
    feed_post: string;
    feed_sport: string;
}

interface CrewBattleFeedContentCardProps {
    feed: Feed;
}

function CrewBattleFeedContentCard({ feed }: CrewBattleFeedContentCardProps) {
    const [imgPath, setImgPath] = useState("");

    useEffect(() => {
        if (feed.feed_img.includes("CrewDefault")) {
            setImgPath('img/default/CrewDefault.png');
        } else if(feed.feed_img != "CrewDefault") {
            setImgPath(`${BASE_URL}${feed.feed_img}`);
        }
        console.log("이미지 경로", imgPath);
    },[feed.feed_img]);
    return (
        <div className="container">
            <div className="form-control" style={{ width: '100%'}}>
                <div className="d-flex justify-content-center align-items-center">
                    <img src={imgPath} alt="Running" className="img-fluid"/>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                    <div>{feed.feed_post}</div>
                    <div>{feed.feed_kcal}kcal</div>
                </div>
            </div>
        </div>
    );
}

export default CrewBattleFeedContentCard;
