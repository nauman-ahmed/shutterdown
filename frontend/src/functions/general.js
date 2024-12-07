export const removeId = (obj) => {
    const { _id, ...rest } = obj;
    return rest;
  };