import { Text } from "react-native";
import { format, parse } from "date-fns";
import translations from "../../../localization";
import store from "../../store/store";
import { useScale } from "../../hooks/utils/useScale";

const ChosenPeriodText = ({ formattedDate, monthRange, weekRange, chosenPeriod }) => {

    const { s, vs } = useScale()

    const getMonthName = (dateString) => {
        try {
            const parsedDate = parse(dateString, 'dd.MM.yyyy', new Date());
            const monthIndex = parsedDate.getMonth(); // Получаем индекс месяца (0 - январь, 11 - декабрь)
            const year = parsedDate.getFullYear();

            const monthsEn = [
                'January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const monthsLv = [
                'Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs', 
                'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris'
            ];

            const months = store.language === 'lv' ? monthsLv : monthsEn;
            return `${months[monthIndex]} ${year}`;
        } catch (error) {
            console.error('Invalid date format:', dateString);
            return 'Invalid date';
        }
    };

    return ( 
        <Text style={{ color: '#222222', fontWeight: '600', fontSize: vs(14) }}>
            {chosenPeriod === 'day'
                ? formattedDate === format(new Date(), 'dd.MM.yyyy') 
                    ? translations[store.language]?.today
                    : formattedDate
                : chosenPeriod === 'week'
                ? `${weekRange.startDate} - ${weekRange.endDate}`
                : getMonthName(monthRange.startDate)
            }
        </Text>
    )
};

export default ChosenPeriodText;