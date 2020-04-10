/* eslint-disable import/prefer-default-export */

// CREATES AN ARRAY OF USERS FROM ARRAY OF OBJECTS

export function getArrayOfAllUsers(arrayOfObjects: { Items: string | any[] }) {
    const fullArrayOfUsers: any[] = [];

    for (let i = 0, l = arrayOfObjects.Items.length; i < l; i++) {
        fullArrayOfUsers.push(arrayOfObjects.Items[i].userName);
    }

    const arrayWithoutDuplicates = fullArrayOfUsers.filter(
        (value, index) => fullArrayOfUsers.indexOf(value) === index
    );

    return arrayWithoutDuplicates;
}
