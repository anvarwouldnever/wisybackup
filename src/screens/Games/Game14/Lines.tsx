import React from 'react'
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { Path, Line } from 'react-native-svg';

const AnimatedLine = Animated.createAnimatedComponent(Line);

const Lines = ({ lines, isDrawing, lineStartX, lineStartY, lineEndX, lineEndY }) => {

    const animatedProps = useAnimatedProps(() => ({
        x1: lineStartX.value,
        y1: lineStartY.value,
        x2: lineEndX.value,
        y2: lineEndY.value,
    }));

    return (
        <Svg
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
            }}
        >
            {lines.map((line, index) => {
                const dx = line.x2 - line.x1;
                const dy = line.y2 - line.y1;

                const controlX1 = line.x1 + dx * 0.50;
                const controlY1 = line.y1;
                const controlX2 = line.x2 - dx * 0.50;
                const controlY2 = line.y2;

                const pathData = `M ${line.x1},${line.y1} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${line.x2},${line.y2}`;

                return <Path key={index} d={pathData} stroke={line.color} strokeWidth="2" fill="none" />;
            })}

            {isDrawing && <AnimatedLine onResponderMove={(_) => {}} animatedProps={animatedProps} stroke={"#504297"} strokeWidth="2" />}
        </Svg>
    );
};

export default Lines