import { Text, useWindowDimensions } from "react-native";
import { format, parse } from "date-fns";

const ChosenPeriodText = ({ formattedDate, monthRange, weekRange, chosenPeriod }) => {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const getMonthName = (dateString) => {
        try {
            // Парсим дату из формата 'dd.MM.yyyy' в объект Date
            const parsedDate = parse(dateString, 'dd.MM.yyyy', new Date());
            return format(parsedDate, 'MMMM yyyy'); // Преобразуем дату в "January 2026"
        } catch (error) {
            console.error('Invalid date format:', dateString);
            return 'Invalid date';
        }
    };

    return <Text style={{ color: '#222222', fontWeight: '600', fontSize: windowHeight * (14 / 800) }}>
                                {chosenPeriod === 'day'
                                    ? formattedDate === format(new Date(), 'dd.MM.yyyy') 
                                        ? 'Today' 
                                        : formattedDate
                                    : chosenPeriod === 'week'
                                    ? `${weekRange.startDate} - ${weekRange.endDate}`
                                    : getMonthName(monthRange.startDate)}
                            </Text>
};

export default ChosenPeriodText;