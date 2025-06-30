import React from "react";
import pill_c from "../../assets/free-icon-pill-5405609.png";
import pill_t from "../../assets/free-icon-tablet-7038906.png";

interface PillFormData {
    _id: string;
    name: string;
    description: string;
    intakeCycle: Array<"morning" | "lunch" | "evening">;
    isCurrentlyUsed: boolean;
    useAlarm: boolean;
    pillType: "pill" | "supplement"; // 약 / 영양보조제
    userId: string;
}

interface ModalFormProps {
    formData: PillFormData;
    onChange: (field: string, value: string | boolean | string[]) => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ formData, onChange }) => {
        const handleIntakeCycleChange = (cycle: "morning" | "lunch" | "evening") => {
        const newCycle = formData.intakeCycle.includes(cycle)
        ? formData.intakeCycle.filter((c) => c !== cycle)
        : [...formData.intakeCycle, cycle];

        onChange("intakeCycle", newCycle);
    };

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
            <label className="font-bold w-24">복용 주기</label>
            <div className="flex gap-6">
            {[
                { value: "morning", label: "아침" },
                { value: "lunch", label: "점심" },
                { value: "evening", label: "저녁" },
            ].map(({ value, label }) => (
                <label key={value} className="flex items-center gap-1">
                <input
                    type="checkbox"
                    checked={formData.intakeCycle.includes(value as any)}
                    onChange={() => handleIntakeCycleChange(value as any)}
                />
                {label}
                </label>
            ))}
            </div>
        </div>

        {/* 약 종류 */}
        <div className="flex items-center w-[300px] md:w-[500px]">
            <label className="font-bold w-24">약 종류</label>
            <div className="flex gap-6 items-center">
            <label className="flex items-center gap-1">
                <input
                type="radio"
                name="type"
                value="supplement"
                checked={formData.pillType === 'supplement'}
                onChange={() => onChange('pillType', 'supplement')}
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
                checked={formData.pillType === 'pill'}
                onChange={() => onChange('pillType', 'pill')}
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
            {[true, false].map((bool) => (
                <label key={String(bool)} className="flex items-center gap-1">
                    <input
                        type="radio"
                        name="alarm"
                        value={String(bool)} // 문자열로 변환해서 넘김 (필수)
                        checked={formData.useAlarm === bool}
                        onChange={() => onChange('useAlarm', bool)}
                    />
                    {bool ? 'ON' : 'OFF'}
                </label>
            ))}
            </div>
        </div>
        </div>
    );
};

export default ModalForm;
