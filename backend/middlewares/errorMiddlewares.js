
function handleBadRequest(err, req, res, next) {
    if (err.status === 400) {
        return res.status(400).send({ message: err.message || "Bad Request" });
    }
    next(err); 
}

function handleUnauthorized(err, req, res, next) {
    if (err.status === 401) {
        return res.status(401).send({ message: err.message || "Unauthorized" });
    }
    next(err); 
}

function handleNotfound(err, req, res, next) {
    if (err.status === 404) {
        return res.status(404).send({ message: err.message || "Not Found" });
    }
    next(err); 
}


function handleError(err, req, res, next) {
    res.status(500).send({ message: "Something went wrong, try again later "+ err });
}

export default { handleBadRequest, handleUnauthorized, handleNotfound, handleError };
