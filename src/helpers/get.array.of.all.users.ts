export function getArrayOfAllUsers(arrayOfObjects) {
    const fullArrayOfUsers = [];

    for (let i = 0, l = arrayOfObjects.Items.length; i < l; i++) {
        fullArrayOfUsers.push(arrayOfObjects.Items[i].userName);
    }

    const arrayWithoutDuplicates = fullArrayOfUsers.filter(
        (value, index) => fullArrayOfUsers.indexOf(value) === index
    );

    return arrayWithoutDuplicates;
}
