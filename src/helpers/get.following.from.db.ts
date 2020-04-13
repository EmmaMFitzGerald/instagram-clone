// eslint-disable-next-line import/prefer-default-export

// eslint-disable-next-line import/prefer-default-export
export function getListOfPeopleYouFollow(peopleYouFollow: any): any {
    console.log("inside getListOfPeopleYouFollow: ", peopleYouFollow)
    const listOfPeopleYouFollow = [];

    for (let i = 0, l = peopleYouFollow.length; i < l; i++) {
        console.log(
            "in the loop peopleYouFollow[i].following",
            peopleYouFollow[i].following
        );
        listOfPeopleYouFollow.push(peopleYouFollow[i].following);
    }

    console.log("listOFPeopleYouFollow", listOfPeopleYouFollow)

    // eslint-disable-next-line func-names
    const filteredArray = listOfPeopleYouFollow.filter(function(el) {
        return el !== " ";
    });

    return filteredArray;
}
