import characterImg from "../assets/YakTok_character_base.svg";
import YakTokLogo from '../assets/YakTok_logo.png';

export default function LoadingPage() {
    return (
        <div className="loading-container">
        <img src={characterImg} alt="로딩 캐릭터" className="jumping-character w-40" />
        <img src={YakTokLogo} alt="약톡logo" className="w-40" />
        </div>
    );
}
