import React, { useState } from "react";

function CrewBattleFeedModal() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [feedContent, setFeedContent] = useState('');
    const [kcalType, setKcalType] = useState('direct');
    const [kcal, setKcal] = useState(0);
    const [time, setTime] = useState<number | string>(0); // 초기값을 숫자로 설정
    const [sport, setSport] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            selectedFile,
            feedContent,
            kcalType,
            kcal,
            time,
            sport
        };
        console.log('Form Data:', formData);
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                {/* 운동 사진 */}
                <div className="form-group form-control">
                    <label>운동 사진</label>
                    <input
                        className="form-control"
                        type="file"
                        id="formFile"
                        onChange={handleFileChange}
                    />
                </div>
                <br />
                {/* 피드 내용 */}
                <div className="form-group form-control">
                    <label>피드 내용</label>
                    <input
                        type="text"
                        className="form-control"
                        value={feedContent}
                        onChange={(e) => setFeedContent(e.target.value)}
                    />
                </div>
                <br />
                {/* 칼로리 입력 방식 */}
                <div className="form-control">
                    <label>칼로리 입력 방식</label>
                    <div className="container d-flex justify-content-between w-100">
                        <div className="tabs form-check form-check-inline w-100">
                            <input
                                type="radio"
                                id="direct"
                                name="postOption"
                                value="direct"
                                checked={kcalType === 'direct'}
                                onChange={(e) => setKcalType(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="direct">칼로리 직접 입력</label>

                            <input
                                type="radio"
                                id="indirect"
                                name="postOption"
                                value="indirect"
                                checked={kcalType === 'indirect'}
                                onChange={(e) => setKcalType(e.target.value)}
                            />
                            <label className="tab w-100 text-center" htmlFor="indirect">운동 종목으로 칼로리 계산</label>
                            <span className='glider2'></span>
                        </div>
                    </div>
                </div>
                <br />
                {/* 칼로리 입력 */}
                {kcalType === 'direct' && (
                    <>
                        <div className="form-group form-control">
                            <label>칼로리 입력</label>
                            <input
                                type="text"
                                className="form-control"
                                value={kcal}
                                onChange={(e) => setKcal(Number(e.target.value))}
                            />
                        </div>
                        <br />
                    </>
                )}
                {/* 운동 종목 */}
                {kcalType === 'indirect' && (
                    <>
                        <div className='form-group form-control'>
                            <label>운동 종목</label>
                            <input 
                                className='form-control' 
                                type="text" 
                                list="list" 
                                id="sport" 
                                value={sport} // 선택된 값 표시
                                onChange={(e) => setSport(e.target.value)} // 값이 변경될 때 상태 업데이트
                            />
                            <datalist id="list">
                                <option value="산악" />
                                <option value="달리기" />
                                <option value="걷기" />
                                <option value="자전거" />
                                <option value="헬스" />
                                <option value="배드민턴" />
                            </datalist>
                        </div>
                        <br />
                    </>
                )}
                {/* 운동 시간 */}
                <div className="form-group form-control">
                    <label>운동 시간</label>
                    <input
                        type="text"
                        className="form-control"
                        value={time === 0 ? '' : time} // 입력 필드가 비어 있으면 빈 문자열을 표시
                        onChange={(e) => setTime(e.target.value === '' ? 0 : Number(e.target.value))} // 빈 값일 경우 0, 아니면 숫자
                        placeholder="30분 단위로 운동시간을 입력해주세요 ex) 0.5, 1, 1.5"
                    />
                </div>
                <br />
                {/* 폼 제출 버튼 */}
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">피드 생성</button>
                    &nbsp;&nbsp;&nbsp;
                    <button type="button" className="btn btn-danger">취소</button>
                </div>
            </form>
        </div>
    );
}

export default CrewBattleFeedModal;
