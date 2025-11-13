export const validFullName = (fullName) => {
    const regex = /^[A-Za-z ]+$/;

    return regex.test(fullName);
}

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
}

export const validatePhone = (phone) => {
    const regex = /^[6-9]\d{9}$/;

    return regex.test(phone);
}

export const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

    return regex.test(password);
}


