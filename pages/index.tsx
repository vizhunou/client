import { Slider } from "../components/Slider/Slider";

export default () => {
    return (
        <div>
            <Slider valueMin={100}  valueMax={176} onChange={console.log} initialValue={100}></Slider>
        </div>
    )
}

