// eslint-disable-next-line import/prefer-default-export
export function sortPhotosByDate(usersPhotos: {
    Items: { UploadTime: number }[];
}): any {
    console.log("usersPhotos in sort", usersPhotos);

    return usersPhotos.Items.sort(function(
        a: { UploadTime: number },
        b: { UploadTime: number }
    ) {
        return b.UploadTime - a.UploadTime;
    });
}
