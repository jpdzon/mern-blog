import { Link } from "react-router-dom";

export default function Post() {
    return (
        <div className="post">
            <div className="image">
                <img src="https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_auto,w_1000,h_667/at%2Fhouse%20tours%2F2024%2Fapril%2Fcass-d%2Ftours-australia-cass-d-34" alt="" />
            </div>
            <div className="texts">
                <h2>An Artist’s New Build Home in Melbourne Was the Perfect Canvas to Fill with Colors</h2>
                <p className="info">
                    <a href="" className="author">Cullen Ormond</a>
                    <time>2023-01-06 16:45</time>
                </p>
                <p className="summary">Artist and photographer Cass Danson’s work is super colorful and encourages such an intense feeling of happiness that it feels like it’s bursting off the canvas. So, it’s no surprise that three years ago, after buying a new-build house in West Melbourne, Australia, she had to infuse it with color. </p>
            </div>
        </div>
    );
}