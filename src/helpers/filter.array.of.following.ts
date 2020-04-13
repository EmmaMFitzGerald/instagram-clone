// eslint-disable-next-line import/prefer-default-export

// eslint-disable-next-line import/prefer-default-export
export function getListOfPeopleYouFollow(peopleYouFollow: any): any {
    const listOfPeopleYouFollow = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0, l = peopleYouFollow.length; i < l; i++) {
        listOfPeopleYouFollow.push(peopleYouFollow[i].following);
    }

    // eslint-disable-next-line func-names
    const filteredArray = listOfPeopleYouFollow.filter(function(el) {
        return el !== " ";
    });

    return filteredArray;
}
