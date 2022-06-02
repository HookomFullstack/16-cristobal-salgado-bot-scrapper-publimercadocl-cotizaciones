const addCategory = (status) => {
    // uniquie category
    
    const uniqueStatus = [...new Set(status)];
    
    uniqueStatus.forEach((status, index) => {
        uniqueStatus[index] = `${index + 1} ${status}`
    });
    return uniqueStatus;
}

module.exports = {
    addCategory
}