export function getLikes(arrayOfObjects: any):any {
    const arrayOfLikes = [];

    for (let i = 0, l = arrayOfObjects.length; i < l; i++) {
        arrayOfLikes.push(arrayOfObjects[i].likes);
    }

    return arrayOfLikes;
}
