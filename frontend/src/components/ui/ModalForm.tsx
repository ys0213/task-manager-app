import React from "react";
import pill_c from "../../assets/free-icon-pill-5405609.png";
import pill_t from "../../assets/free-icon-tablet-7038906.png";

interface ModalFormProps {
    formData: {
        name: string;
        time: string;
        type: string;
        description: string;
        alarm: string;
    };
    onChange: (field: string, value: string) => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ formData, onChange }) => {


    return (
        <div className="space-y-6 text-sm text-[#333]">
        {/* 약 이름 */}
        <div className="flex items-center justify-between pb-3">
            <label className="font-bold w-24">약 이름</label>
            <input
            type="text"
            required
            className="w-full px-3 py-2 rounded border-b border-green-200 "
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="예: 타이레놀"
            />
        </div>

        {/* 약 복용 시간 */}
        <div className="flex items-center">
            <label className="font-bold w-24">약 복용시간</label>
            <div className="flex gap-6">
            {['08:00', '13:00', '19:00'].map((time) => (
                <label key={time} className="flex items-center gap-1">
                <input
                    type="radio"
                    name="time"
                    value={time}
                    checked={formData.time === time}
                    onChange={() => onChange('time', time)}
                />
                {time === '08:00'
                    ? '아침 08:00'
                    : time === '13:00'
                    ? '점심 13:00'
                    : '저녁 19:00'}
                </label>
            ))}
            </div>
        </div>

        {/* 약 종류 */}
        <div className="flex items-center">
            <label className="font-bold w-24">약 종류</label>
            <div className="flex gap-6 items-center">
            <label className="flex items-center gap-1">
                <input
                type="radio"
                name="type"
                value="supplement"
                checked={formData.type === 'supplement'}
                onChange={() => onChange('type', 'supplement')}
                />
                <div className="flex-col flex items-center gap-1 m-1">
                    <img src={pill_c} alt="건강보조제" className="w-12" />
                    건강보조제
                </div>
            </label>
            <label className="flex items-center gap-1">
                <input
                type="radio"
                name="type"
                value="hospital"
                checked={formData.type === 'hospital'}
                onChange={() => onChange('type', 'hospital')}
                />
                <div className="flex-col flex items-center gap-1 m-1">
                    <img src={pill_t} alt="병원약" className="w-12" />
                    병원약
                </div>
            </label>
            </div>
        </div>

        {/* 약 메모 */}
        <div className="flex items-center justify-between pt-3">
            <label className="font-bold w-24">약 메모</label>
            <textarea
            className="w-full border px-3 py-2 rounded"
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="예: 공복 복용"
            />
        </div>

        {/* 알람 설정 */}
        <div className="flex items-center">
            <label className="font-bold w-24">알람 설정</label>
            <div className="flex gap-6">
            {['on', 'off'].map((opt) => (
                <label key={opt} className="flex items-center gap-1">
                <input
                    type="radio"
                    name="alarm"
                    value={opt}
                    checked={formData.alarm === opt}
                    onChange={() => onChange('alarm', opt)}
                />
                {opt.toUpperCase()}
                </label>
            ))}
            </div>
        </div>
        </div>
    );
};

export default ModalForm;
