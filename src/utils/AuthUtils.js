export default {
    hasRolesAll(userRoles, roles) {
        let intersect = userRoles.filter((elem) => roles.includes(elem));
        return intersect.length == roles.length;
    },
    hasRolesAny(userRoles, roles) {
        let intersect = userRoles.filter((elem) => roles.includes(elem));
        return intersect.length > 0;
    }
}