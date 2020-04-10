/* eslint-disable no-plusplus */
export function getListFollowers(followers: any): any {
    const listOfFollowers = [];

    for (let i = 0, l = followers.Items.length; i < l; i++) {
        listOfFollowers.push(followers.Items[i].userName);
    }

    console.log("list:", listOfFollowers);

    return listOfFollowers;
}
