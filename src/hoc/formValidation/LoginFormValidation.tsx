export const validateLoginEmail = (email: any) => {
    var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (!pattern.test(email)) {
        return {
            error: true,
            message: "Invalid Email Format. Please enter correct email",
        };
    }
    return {
        error: false,
        message:""
    };
};

export const validateLoginPassword = (password: string) => {
    if (password === "") {
        return {
            error: true,
            message: "Password is required",
        };
    }
    return {
        error: false,
        message: ""
    };
};
