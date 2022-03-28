export default {
    hasGroupsAll(userGroups, routeGroups) {
        let intersect = userGroups.filter((elem) => routeGroups.includes(elem));
        return intersect.length === routeGroups.length;
    },
    hasGroupsAny(userGroups, routeGroups) {
        let intersect = userGroups.filter((elem) => routeGroups.includes(elem));
        return !routeGroups.length || intersect.length > 0;
    }
}