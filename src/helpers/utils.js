export const rtrim = (str, char)  => {
    const regex = new RegExp(char + '+$');
    return str.replace(regex, '');
}