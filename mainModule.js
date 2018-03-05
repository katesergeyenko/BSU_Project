var mainModule = (function () {
    var name = "Main Module";

    var filterConfig = {
        author: "",
        date: "",
        tag: "",
    }

    // private methods and functions ...

    function  getDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function find(data, propertyName, propertyValue) {
        let result = [];

        for (var i = 0; i < data.length; i++) {
            let value = data[i][propertyName];

            if (typeof(value) === "object") {
                if (Array.isArray(value) && value.indexOf(propertyValue) >= 0) {
                    result.push(data[i]);
                }
                else if (value instanceof Date && getDate(value).getTime() === getDate(propertyValue).getTime()) {
                    result.push(data[i]);
                }
            }
            else if (typeof(value) === "string" && value === propertyValue) {
                result.push(data[i]);
            }
        }

        return result;
    }

    function findByFilterConfig(data, filterConfig) {
        let filteredData = data;

        for (var entity in filterConfig) {
            filteredData = find(filteredData, entity, filterConfig[entity]);
        }

        return filteredData;
    }

    // ... private methods and functions

    function sortByAuthorAsc(post1, post2) {
        return (post2.author < post1.author) - (post1.author < post2.author);
    }

    function sortByAuthorDesc(post1, post2) {
        return (post1.author < post2.author) - (post2.author < post1.author);
    }

    function sortByDateAsc(post1, post2) {
        return post1.createdAt - post2.createdAt;
    }

    function sortByDateDesc(post1, post2) {
        return post2.createdAt - post1.createdAt;
    }

    function sortByTagAsc(post1, post2) {
        return post1.tag.length - post2.tag.length;
    }

    function sortByTagDesc(post1, post2) {
        return post2.tag.length - post1.tag.length;
    }

    function getPhotoPosts(skip, top, filterConfig) {
        var partOfPhotoPosts = photoPosts.slice(skip || 0, top || 10);
        var filteredPartOfPhotoPosts = findByFilterConfig(partOfPhotoPosts, filterConfig);
        filteredPartOfPhotoPosts.sort(sortByDateAsc);

        /*
        if (filterConfig.name === "author") {
            if (filterConfig.order === "asc") {
                partOfPhotoPosts.sort(sortByAuthorAsc);
            }
            else if (filterConfig.order === "desc") {
                partOfPhotoPosts.sort(sortByAuthorDesc);
            }
        }

        else if (filterConfig.name === "date") {
            if (filterConfig.order === "asc") {
                partOfPhotoPosts.sort(sortByDateAsc);
            }
            else if (filterConfig.order === "desc") {
                partOfPhotoPosts.sort(sortByDateDesc);
            }
        }

        else if (filterConfig.name === "tag") {
            if (filterConfig.order === "asc") {
                partOfPhotoPosts.sort(sortByTagAsc);
            }
            else if (filterConfig.order === "desc") {
                partOfPhotoPosts.sort(sortByTagDesc);
            }
        }
        */

        return filteredPartOfPhotoPosts;
    }

    function findPostById(id) {
        for (var i = 0; i < photoPosts.length; i++){
            if (photoPosts[i].id === id) {
                return i;
            }
            else {
                return -1;
            }
        }
    }

    function getPhotoPost(id) {
        if (findPostById(id) !== -1) {
            return  photoPosts[findPostById(id)];
        }
        else {
            return -1;
        }
    }

    function validatePhotoPost(photoPost) {
        if (photoPost.id !== undefined && find("id", photoPost.id).length === 0 && typeof(photoPost.id) === "string" &&
            photoPost.description !== undefined && typeof(photoPost.description) === "string" && photoPost.description.length < 200 &&
            photoPost.createdAt !== undefined && photoPost.createdAt instanceof  Date &&
            photoPost.author !== undefined && photoPost.author.length > 0 && typeof(photoPost.author) === "string" &&
            photoPost.photoLink !== undefined && photoPost.photoLink.length > 0 && typeof(photoPost.photoLink) === "string"
        ) {
            return true;
        }
        else {
            return false;
        }
    }

    function addPhotoPost(photoPost) {
        if (validatePhotoPost(photoPost)) {
            photoPost.authorPhoto = photoPost.authorPhoto || "images\\person.png";
            photoPosts.push(photoPost);

            return true;
        }
        else {
            return false;
        }
    }

    function editPhotoPost(id, photoPost) {
        if (validatePhotoPost(photoPost)) {
            getPhotoPost(id).description = photoPost.description || getPhotoPost(id).description;
            getPhotoPost(id).photoLink = photoPost.photoLink || getPhotoPost(id).photoLink;
            getPhotoPost(id).hashTags = photoPost.hashTags || getPhotoPost(id).hashTags;

            return true;
        }
        else {
            return false;
        }
    }

    function removePhotoPost(id) {
        if (findPostById(id) !== -1) {
            photoPosts.splice(findPostById(id), 1);
        }
    }

    function sort(element) {
        element.className = element.className.indexOf("asc") >= 0 ? "desc" : "asc";
        if (element.id === "author") {
            filterConfig.name = "author", filterConfig.order = element.className;
        }
        else if (element.id === "date") {
            filterConfig.name = "date", filterConfig.order = element.className;
        }
        else if (element.id === "tag") {
            filterConfig.name = "tag", filterConfig.order = element.className;
        }
    }
    /*------------------------------------------------------------*/
    return {
        getPhotoPosts: getPhotoPosts,
        //filterConfig: filterConfig,
        getPhotoPost: getPhotoPost,
        validatePhotoPost: validatePhotoPost,
        addPhotoPost: addPhotoPost,
        editPhotoPost: editPhotoPost,
        removePhotoPost: removePhotoPost,
    }

}());

