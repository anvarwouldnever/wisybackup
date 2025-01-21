import { Text, useWindowDimensions } from "react-native";
import { format } from "date-fns";

const ChosenPeriodText = ({ formattedDate, monthRange, weekRange, chosenPeriod }) => {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    return <Text style={{ color: '#222222', fontWeight: '600', fontSize: windowHeight * (14 / 800) }}>
                                {chosenPeriod === 'day'
                                    ? formattedDate === format(new Date(), 'dd.MM.yyyy') 
                                        ? 'Today' 
                                        : formattedDate
                                    : chosenPeriod === 'week'
                                    ? `${weekRange.startDate} - ${weekRange.endDate}`
                                    : `${monthRange.startDate} - ${monthRange.endDate}`}
                            </Text>
};

export default ChosenPeriodText;