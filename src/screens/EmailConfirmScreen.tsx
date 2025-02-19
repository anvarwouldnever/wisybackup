import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { openInbox } from 'react-native-email-link';
import Logo from '../components/Logo';
import EmailModal from '../components/EmailModal';
import store from '../store/store';
import api from '../api/api';
import image from '../images/noti-img 2 (1).png';
import translations from '../../localization';

const EmailConfirmScreen = () => {

  const { width, height } = Dimensions.get('window');
  const navigation = useNavigation();
  const [modal, setModal] = useState(false);
  const [timer, setTimer] = useState(20);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const resetPassword = async () => {
    try {
      setIsButtonDisabled(true);
      setTimer(20);
      const response = await api.forgotPassword(store.holdEmail);
    } catch (error) {
      console.log(error);
    }
  };

  // Обрабатываем таймер
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isButtonDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsButtonDisabled(false); // Включаем кнопку, когда таймер закончился
      clearInterval(interval!);
    }

    return () => clearInterval(interval!);
  }, [timer, isButtonDisabled]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Logo />
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: width * (312 / 360),
          height: height * (356 / 800),
        }}
      >
        <Image
          source={image}
          style={{
            width: width * (244 / 360),
            height: height * (244 / 800),
            aspectRatio: 1 / 1,
          }}
        />
        <View
          style={{
            width: width * (312 / 360),
            height: height * (88 / 800),
            justifyContent: 'space-between',
            flexDirection: 'column',
          }}
        >
          <Text
            style={{
              width: width * (312 / 360),
              color: '#222222',
              fontWeight: '600',
              fontSize: height * (20 / 800),
              lineHeight: height * (28 / 800),
              textAlign: 'center',
              height: height * (28 / 800),
            }}
          >
            {translations?.[store.language]?.followInstructions}
          </Text>
          <Text
            style={{
              width: width * (312 / 360),
              color: '#555555',
              fontWeight: '400',
              fontSize: height * (14 / 800),
              lineHeight: height * (24 / 800),
              height: height * (48 / 800),
              textAlign: 'center',
            }}
          >
            {translations?.[store.language]?.thereIsALink}
          </Text>
        </View>
      </View>
      <EmailModal modal={modal} setModal={setModal} />
      <View
        style={{
          marginTop: 50,
          marginBottom: 30,
          width: width * (312 / 360),
          height: height * (124 / 800),
          justifyContent: 'space-between',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => setModal(true)}
          style={{
            backgroundColor: '#504297',
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            width: width * (312 / 360),
            height: height * (56 / 800),
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: height * (14 / 800),
              lineHeight: height * (24 / 800),
            }}
          >
            {translations?.[store.language]?.openInbox}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => resetPassword()}
          disabled={isButtonDisabled} // Делаем кнопку неактивной
          style={{
            justifyContent: 'center',
            borderRadius: 100,
            borderWidth: 1,
            borderColor: '#E5E5E5',
            alignItems: 'center',
            width: width * (312 / 360),
            height: height * (56 / 800),
            opacity: 1, // Меняем прозрачность
          }}
        >
          <Text
            style={{
              color: '#504297',
              fontWeight: '600',
              fontSize: height * (14 / 800),
              lineHeight: height * (24 / 800),
            }}
          >
            {isButtonDisabled
              ? `${translations?.[store.language]?.resendCodeIn} 00:${timer.toString().padStart(2, '0')}`
              : `${translations?.[store.language]?.resendCode}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EmailConfirmScreen;
