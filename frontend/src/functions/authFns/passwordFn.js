export function CheckPassword(submittedPassword) {
    if (submittedPassword?.length < 8) {
        return "Password must be at least 8 characters long.";
    }

    if (
        !/[a-z]/.test(submittedPassword) ||
        !/[A-Z]/.test(submittedPassword) ||
        !/[0-9]/.test(submittedPassword)
    ) {

        return "Password must contain at least one uppercase letter, one lowercase letter, and one number."
    }

    return "Password is valid!"
}
