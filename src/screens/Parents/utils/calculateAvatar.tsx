
export const calculateAvatar = (avatars, avatarId) => {
    const avatarObj = avatars.find(avatar => avatar?.id === avatarId);
    const avatarUrl = avatarObj ? avatarObj?.image?.url : require('../../../images/Dog.png');
    const isSvg = typeof avatarUrl === 'string' && avatarUrl.endsWith('.svg');
    return { avatarUrl, isSvg };
};
