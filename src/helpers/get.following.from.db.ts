// eslint-disable-next-line import/prefer-default-export
export function getListOfPeopleYouFollow(peopleYouFollow: any): any {
    const listOfPeopleYouFollow = [];

    for (let i = 0, l = peopleYouFollow.length; i < l; i++) {
        listOfPeopleYouFollow.push(peopleYouFollow[i].following);
    }

    console.log("list:", listOfPeopleYouFollow);

    return listOfPeopleYouFollow;
}
